import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase-server';
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/system-prompt';
import { effects, canAccess } from '@/lib/effects';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Free-tier daily usage cap */
const FREE_DAILY_LIMIT = 10;

export async function POST(request) {
  try {
    /* ── Auth check ── */
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    /* ── Parse body ── */
    const { effectId, effectName, effectDescription, html } = await request.json();

    if (!effectId || !html?.trim()) {
      return NextResponse.json(
        { error: 'Missing effectId or html in request body.' },
        { status: 400 }
      );
    }

    /* ── Tier gating ── */
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, usage_count')
      .eq('id', user.id)
      .single();

    const tier = profile?.tier || 'free';
    const effect = effects.find((e) => e.id === effectId);

    if (effect && !canAccess(effect, tier)) {
      return NextResponse.json(
        { error: 'This effect requires a Pro subscription.' },
        { status: 403 }
      );
    }

    /* ── Free-tier rate limit ── */
    if (tier === 'free' && (profile?.usage_count || 0) >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Free tier is limited to ${FREE_DAILY_LIMIT} enhancements per day. Upgrade to Pro for unlimited.` },
        { status: 429 }
      );
    }

    /* ── Call OpenAI ── */
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildUserMessage({
            effectName: effectName || effectId,
            effectDescription: effectDescription || '',
            html,
          }),
        },
      ],
    });

    let enhanced = completion.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if the model wraps them
    enhanced = enhanced
      .replace(/^```html?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    if (!enhanced) {
      return NextResponse.json(
        { error: 'AI returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    /* ── Increment usage ── */
    await supabase.rpc('increment_usage', { user_id: user.id }).catch(() => {
      // Non-critical — fall through
    });

    return NextResponse.json({ html: enhanced });
  } catch (err) {
    console.error('[/api/enhance]', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

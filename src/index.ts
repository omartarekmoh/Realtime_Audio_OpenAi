import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

const DEFAULT_INSTRUCTIONS = `You are helpful and have some tools installed.

In the tools you have the ability to control a robot hand.
`;

app.post('/rtc-connect', async (c) => {
	const body = await c.req.text();
	const url = new URL('https://api.openai.com/v1/realtime');
	url.searchParams.set('model', 'gpt-4o-realtime-preview-2024-12-17');
	url.searchParams.set('instructions', DEFAULT_INSTRUCTIONS);
	url.searchParams.set('voice', 'ash');

	const response = await fetch(url.toString(), {
		method: 'POST',
		body,
		headers: {
			Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
			'Content-Type': 'application/sdp',
		},
	});

	if (!response.ok) {
		throw new Error(`OpenAI API error: ${response.status}`);
	}

	const sdp = await response.text();

	return c.body(sdp, {
		headers: {
			'Content-Type': 'application/sdp',
		},
	});
});

export default app;

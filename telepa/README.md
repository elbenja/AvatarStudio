# Telepa

From the repository root, run `node telepa/server.mjs` and open http://127.0.0.1:4174. The sample round works without an API key.

For live play, put `OPENAI_API_KEY=your-project-key` in `telepa/.env` and run `node --env-file=telepa/.env telepa/server.mjs` with Node 22 or newer. The local server listens on loopback only and sends game clues to OpenAI. Use fictional or public figures in the Person category. See [the prototype plan](PLAN.md).

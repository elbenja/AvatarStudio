# Telepa

From the repository root, run `node telepa/server.mjs` and open http://127.0.0.1:4174. The sample round works without an API key.

For live play, put `OPENAI_API_KEY=your-project-key` in `telepa/.env` and run `node --env-file=telepa/.env telepa/server.mjs` with Node 22 or newer. The local server listens on loopback only and sends game clues to OpenAI. You can pick an object, a person, a character, or an animal. For someone you know or a pet, use the relationship and keep private names and details to yourself. See [the prototype plan](PLAN.md).

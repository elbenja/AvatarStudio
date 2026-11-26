# Telepa prototype plan

Telepa is a standalone Silverdesk Lab game. The player silently picks an everyday object, a public figure, or a fictional character. The AI chooses every question and makes the guess. Build chat first, add voice next, and connect the 3D avatar after voice works.

## 1. Chat

- Build a single screen with category selection, a transcript, quick answers, optional typed clues, question count, and a **Ruled out** list. Confirm a guess, correct the last answer, or end and restart a round.
- Start the two-minute countdown when the opening question appears. Keep play available at zero. Use twelve questions as a separate prototype rule, then ask the AI for its best guess or let it concede.
- Run GPT-6 Luna in the Responses API with reasoning effort set to none. Use one request per turn and a structured response with the next action, display text, and explicitly ruled out categories. The app owns the round history. Correcting an answer restores the prior question and clues before asking the model again.
- Try one broad opening question, then favor short questions that separate plausible answers. Guess when the clues support a clear candidate. Treat unsure answers as uncertain. Keep the AI on the game, use age-appropriate language, and avoid private people, personal data, or claims of mind reading.
- Keep the API key on a loopback-only server and avoid saving audio or transcripts in the app. Share the disclosure before play. Run a clearly labeled scripted sample when no key is configured.

Verification: complete and restart a round, correct an answer and check that the exclusion is removed, retry an unsuccessful request, and answer after the timer reaches zero.

## 2. Measure guessing speed

Compare yes/no versus one broad opener using Luna on 30–40 held-out targets. Compare the better prompt against GPT-6.1 Terra. Use the same targets and include ambiguous and corrected answers. Have people play a subset so the cost of typing a clue is reflected in real elapsed time.

Record the share solved within two minutes, questions to first correct guess, wrong guesses, and median and slow turn latency. Count unsolved rounds. Keep the faster model only if the round results support it.

Research: [GuessingGame](https://aclanthology.org/2025.emnlp-main.876/) and [ChatGPT’s Information Seeking Strategy](https://aclanthology.org/2023.inlg-main.11/).

## 3. Voice, then avatar

- Use GPT-Live-1.1 over WebRTC for voice and reuse the winning guessing model. Measure from the end of the player’s answer to the first useful audio.
- Request the mic only on Start voice. Show connecting, listening, speaking, muted, paused, and disconnected states. Test permission denial, device loss, interruptions, silence, and recovery back to chat. End must release the microphone and close the session.
- Before opening access, add server authorization, limits on concurrent sessions and starts, and a server-enforced spend limit. Use the two-minute timer as a design target. Verify actual voice and backend charges before choosing a ceiling up to US$0.50. Check applicable child privacy and safety requirements before making the game available to minors. [OpenAI guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance)
- Connect the avatar to listening, speaking, and guessing states once voice is stable.

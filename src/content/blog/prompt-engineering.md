# Learn Prompt Engineering with Evaluations in Langfuse: Building an Email Labeler

Prompt engineering sounds mysterious until you realize it’s just hypothesis → test → refine.<br/>
You write a prompt, check how the model performs, and then tweak it. The problem? Without structured evaluations, it’s hard to know if you’re actually improving or just guessing. 

![Prompt engineering meme](./img/prompt-engineering.jpeg)

In this tutorial, we’ll build a customer support email labeler as our example. You’ll learn how to:

- Write and refine prompts for a real-world task (triaging SaaS emails)
- Use Langfuse to trace runs, track metrics, and log results
- Evaluate prompts with both hard accuracy and LLM-as-a-judge
- Iteratively improve your system based on data, not vibes

# Learn Prompt Engineering with Evaluations in Langfuse: Building an Email Labeler

Prompt engineering sounds mysterious until you realize it’s just hypothesis → test → refine.<br/>
You write a prompt, check how the model performs, and then tweak it. The problem? Without structured evaluations, it’s hard to know if you’re actually improving or just guessing. 

![Prompt engineering meme](./img/prompt-engineering.jpeg)

In this tutorial, we’ll build a customer support email labeler as our example. You’ll learn how to:

- Write and refine prompts for a real-world task (triaging SaaS emails)
- Use Langfuse to trace runs, track metrics, and log results
- Evaluate prompts with both hard accuracy and LLM-as-a-judge
- Iteratively improve your system based on data, not vibes


**The Eval Loop We’ll Build**:</br>
Here’s the process we’ll follow: <br/>
    1. **Dataset Creation**: realistic support emails with expected categories <br/>
	2. **Prompt Creation**: draft a prompt for the labeler <br/>
	3. **Evaluator Creation**: build an LLM-as-a-Judge with clear rules
	4. **Run Experiment**: test prompt on dataset, log results in Langfuse <br/>
	5. While score < threshold — refine prompt (or taxonomy), re-run

This loop is the backbone of systematic prompt engineering.

## 0. Setup
Install dependencies:
```python 
pip install openai langfuse
```
Initialize Langfuse
```bash
from langfuse import Langfuse

langfuse = Langfuse(
    public_key="your-public-key",
    secret_key="your-secret-key"
)
```
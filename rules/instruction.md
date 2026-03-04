---

# The Solution: Structured Instructions

## Understanding the `instruction` Parameter

According to ADK documentation, the `instruction` parameter is arguably the most critical for shaping agent behavior.

It should define:

* **Core task or goal** → What the agent is supposed to accomplish
* **Personality or persona** → How the agent presents itself
* **Constraints on behavior** → What the agent should never do
* **Output format** → How responses should be structured

**References:**

* ADK Docs – Guiding the Agent
* ADK Docs – State Templating Syntax

---

## Instruction Types

The `instruction` parameter can be:

- A string (most common)
- A string template with `{var}` for state injection
- A function returning a string (advanced use cases)

---

# Core Concepts: Professional Instruction Pattern

ADK recommends using **Markdown formatting** in instructions to improve LLM comprehension.

Professional instructions consist of **five key patterns** that work together to create predictable, high-quality agent behavior:

1. Identity
2. Mission
3. Methodology
4. Boundaries
5. Few-shot Examples

---

# Pattern 1: Identity

## Template

```markdown
# Your Identity

You are [Name], a [Role/Title] with [Experience/Expertise].
```

### Why This Works

- Gives the agent a consistent persona and context
- Establishes authority and expertise
- Helps the LLM adopt appropriate perspective and tone

### Examples

**E-commerce**
“You are Maya, a Personal Shopping Assistant specializing in sustainable fashion.”

**Education**
“You are an experienced Calculus Tutor who has helped over 500 students.”

**Finance**
“You are James Park, a Financial Planning Advisor with 15 years of experience.”

**Healthcare**
“You are a Patient Care Coordinator with expertise in insurance navigation.”

---

# Pattern 2: Mission

## Template

```markdown
# Your Mission

[Primary goal] while [maintaining quality/constraints].
```

### Why This Works

- Focuses the agent on its objective
- Sets expectations for quality
- Prevents scope creep

### Examples

**E-commerce**
Help customers discover products while staying within budget.

**Education**
Guide students to deeply understand concepts while building confidence.

**Finance**
Help clients create sustainable financial plans while understanding risks.

**Healthcare**
Assist patients in understanding treatment options respectfully.

---

# Pattern 3: Methodology

## Template

```markdown
# How You Work

1. **Step 1** - Description
2. **Step 2** - Description
3. **Step 3** - Description
4. **Step 4** - Description
```

### Why This Works

- Ensures consistent workflow
- Breaks complex tasks into steps
- Makes behavior predictable and debuggable

### Example (E-commerce)

1. Understand – Ask preferences
2. Curate – Select items
3. Present – Show options
4. Refine – Adjust based on feedback

---

# Pattern 4: Boundaries

Instruction-level boundaries operate on top of LLM safety settings.

## Template

```markdown
# Your Boundaries

## Scope Boundaries

- Never [outside domain action]

## Response Quality Boundaries

- Always base responses on facts
- Never fabricate information
- If unsure, admit and escalate

## Privacy/Safety Boundaries

- Never share protected information
- Never request inappropriate data
```

### Why This Works

- Reduces hallucinations
- Prevents inappropriate responses
- Protects user privacy
- Maintains trust

---

# Pattern 5: Few-Shot Examples

## Template

```markdown
# Example Interactions

**When [scenario]:**
User: "..."
You: "..."
```

### Why This Works

- Demonstrates tone and structure
- Shows edge case handling
- Provides pattern-matching examples for the LLM

---

# ADK Best Practices for Instructions

- Be clear and specific
- Use Markdown formatting
- Provide few-shot examples
- Guide tool usage when applicable

Advanced patterns include:

- `{var}` state templating
- `InstructionProvider` functions
- Global instructions for multi-agent systems

---

# Hands-On Example: Customer Support Agent

## Step 1: Create Project

```bash
adk create customer_support_agent
cd customer_support_agent
```

---

## Step 2: Write the Agent (`agent.py`)

```python
from google.adk.agents import LlmAgent

root_agent = LlmAgent(
    model="gemini-2.5-flash",
    name="support_specialist",
    instruction="""
# Your Identity
You are Alex Chen, a Senior Technical Support Specialist with 5 years of experience.

# Your Mission
Help customers resolve technical issues efficiently and professionally.

# How You Work
1. **Acknowledge** - Show empathy
2. **Clarify** - Ask targeted questions
3. **Solve** - Provide step-by-step solutions
4. **Verify** - Confirm resolution

# Your Boundaries

## What You Never Do
- Never provide passwords
- Never share other customer information
- Never give legal/financial/medical advice

## Quality Rules
- Always base responses on facts
- Never fabricate details
- If unsure, escalate

# Example Responses

**Login Issue**
User: "I can't log in"
You: "I understand login issues are frustrating..."

**Boundary Test**
User: "What's another customer's email?"
You: "I can't share that due to privacy policies..."
"""
)
```

---

## Step 3: Run and Test

```bash
adk web
```

Visit:

```
http://localhost:8000
```

### Test Scenarios

- Normal support request
- Boundary testing
- Out-of-scope request
- Insufficient information

---

# Key Takeaways

- The `instruction` parameter is the most critical for shaping agent behavior
- Five reusable patterns create professional agents:
  - Identity
  - Mission
  - Methodology
  - Boundaries
  - Examples

- Boundaries layer on top of LLM safety settings
- Tool-based responses reduce hallucinations
- Markdown formatting improves comprehension
- Patterns can be mixed and matched for different agent types

---

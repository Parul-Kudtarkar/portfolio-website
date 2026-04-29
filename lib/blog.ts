import fs from "node:fs"
import path from "node:path"

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category?: string
  tags?: string[]
  content: string
  readingTime?: number
  featured?: boolean
  image?: string
  /** When true, image is still used for listing cards and Open Graph, but not as a hero above the article body. */
  hideHeroImage?: boolean
  audioUrl?: string
}

function readBlogMarkdown(fileName: string): string {
  const absPath = path.join(process.cwd(), "content", "blog", fileName)
  return fs.readFileSync(absPath, "utf8")
}

// Sample blog posts, in production, you might load these from markdown files or a CMS
export const blogPosts: BlogPost[] = [
  {
    slug: "understanding-alphagenome-part-1-biology-problem",
    title: "Understanding AlphaGenome, Part 1: The Biology and the Problem",
    description:
      "From a missing pancreas to cis-regulatory logic: why most disease variants sit outside genes and the range-versus-resolution problem AlphaGenome was built to solve.",
    date: "2026-03-27",
    author: "Parul Kudtarkar",
    category: "Genomics",
    tags: ["AlphaGenome", "Genomics", "Deep Learning", "Gene Regulation", "Transformers"],
    content: `This is the first post in a three-part series on AlphaGenome. Part 1 lays the conceptual groundwork, the biology you need, the computational ideas behind it and the core tension the model was built to resolve. Part 2 walks through the AlphaGenome architecture itself. Part 3 shows you how to run it.

A baby was born with no functioning pancreas.
Then another. Then another.
Ten families, across multiple countries, presenting with the same devastating diagnosis: neonatal diabetes requiring insulin from birth, no exocrine pancreatic function, no explanation.[1] Researchers sequenced every gene. Every protein looked normal.
The answer wasn't in a gene at all.
A team led by researchers at the University of Exeter used epigenomic data from embryonic pancreatic progenitor cells to guide their search through whole genome sequences. What they found was a previously uncharacterized 400-base-pair stretch of DNA located 25,000 base pairs downstream of a gene called PTF1A, far outside any coding region. Six different mutations in that single small stretch were the most common cause of isolated pancreatic agenesis they had ever identified.
The PTF1A gene itself was fine. The protein it makes was fine. But the regulatory switch, a tiny enhancer that told the developing embryo when and where to build a pancreas, was broken. One wrong letter was enough.
That finding wasn't an anomaly. It turned out to be the rule.

Today, we know that **the vast majority of disease-linked genetic variants don't sit inside genes.**[2][3] They sit in the spaces between them, in regions that don't encode any protein, that don't show up in a standard genetic test, that most models can't interpret at all.

This is the problem AlphaGenome was built to solve. But to understand why it's so hard, you first need to understand how genes are actually controlled.

## The operating system running on your DNA

Genes don't just switch themselves on. Something has to flip the switch. And those switches aren't the genes themselves, they're specialized DNA sequences scattered across the genome, often sitting far from the gene they control. They're called **cis-regulatory elements** and you can think of them as the operating system running on top of the genetic hardware.

The main types:

- **Promoters** sit just upstream of a gene. They're the landing pad, the spot where the molecular machinery that "reads" a gene has to dock before it can start transcribing.
- **Enhancers** are stranger. They can sit hundreds of thousands of base pairs away from the gene they control, looping through three-dimensional space[4] to touch the promoter and boost expression. An enhancer controlling a gene in your liver cells might be physically closer in space than it is along the linear genome.
- **Silencers** do the opposite. They dampen expression, or shut it down entirely.

<figure class="my-8" style="max-width: 600px; width: 100%; margin-left: auto; margin-right: auto;"><img src="/enhancer_promoter_looping_diagram.png" alt="Linear chromosome view with enhancer and promoter ~500 kb apart; 3D looping brings them together so a TF-bound enhancer activates the promoter and drives mRNA expression" class="w-full rounded-lg border border-border shadow-sm" style="max-width: 100%; width: 100%; display: block; height: auto;" /><figcaption class="text-center text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">Linear distance vs. 3D chromatin looping: an enhancer and promoter can be hundreds of kilobases apart on the sequence yet close in the nucleus-so a SNP in a TF binding motif can silence a gene without touching its coding sequence.</figcaption></figure>

The proteins that actually bind to these regulatory sequences are called **transcription factors**. Each one recognizes a short, specific stretch of DNA, typically 6 to 20 base pairs long.[5] When a transcription factor finds its motif, it binds. When it binds, it either recruits the transcription machinery or repels it.

Now here's the part that matters for disease.

**A single base pair change inside a transcription factor binding site can abolish binding entirely.**[2][5] The gene itself is fine. The protein it makes is fine. But the regulatory switch is broken. The gene now gets expressed in the wrong tissue. At the wrong time. At the wrong level.

That's enough to cause disease.

This is why studying the regulatory genome matters as much as studying genes themselves. And it's exactly the problem every genomics model has struggled to crack, because cracking it requires holding two things in your head at once that seem fundamentally incompatible.

## The tension that broke every previous model

To model gene regulation computationally, you need two things simultaneously.

**Long sequences.** An enhancer controlling a gene might sit 500,000 base pairs away. If your model's input window doesn't cover that distance, it can never learn the relationship between them.

**Single-nucleotide resolution.** A transcription factor binding site is 6 to 12 base pairs long. If you want to know whether a specific variant disrupts binding, you need to see the exact base. You can't average over the sequence.

The problem: longer sequences at finer resolution means exponentially more computation. Every genomics model before AlphaGenome had to pick a side.

**Wide window, coarse resolution.** Or **fine resolution, tiny window.**

Neither could do what you actually need, see a 500 kb regulatory landscape and resolve a 6 bp binding motif simultaneously.

AlphaGenome's central contribution is solving that tradeoff. But before we get into how (that's Part 2), it helps to understand the two computational ideas it's built from. Because understanding those ideas is what makes the architecture feel inevitable rather than arbitrary.

## Building block 1: CNNs as molecular pattern detectors

Think about what a transcription factor actually does.

It doesn't read the whole genome at once. It diffuses along the DNA, sampling short stretches, lighting up when it finds its specific motif. It's a pattern detector, local, precise, blind to anything outside its small window.

A convolutional neural network filter works the same way.[6]

It slides a small window across the sequence, computing a score at each position. High score means the pattern is there. Low score means it's not. The output, one score per position, is called a **feature map**. And instead of one filter looking for one pattern, a CNN runs hundreds of them in parallel, each learning a different motif from the data.

__CNN_DNA_ANIM__

Some end up resembling known transcription factor binding sites.[7] Some capture splice sites, the exact base pairs where an exon ends and an intron begins. Some find patterns that biologists haven't formally named yet.

What makes stacked CNN layers powerful is that each layer reads the output of the previous one.

The first layer detects atomic patterns in raw DNA, a TATA box, a splice donor signal, a CTCF motif. The second layer detects combinations: a TATA box plus an initiator element at the right spacing. Later layers can detect higher-order structure, a dense cluster of TF motifs that looks like an active enhancer, or a CTCF site marking a chromatin domain boundary.

By the time the sequence passes through several CNN layers, each position is no longer represented as a simple A, C, G, or T. It carries a rich vector of scores answering questions like: *How enhancer-like is the local sequence? Is there a splice site here? A CTCF boundary signal?*

CNNs are excellent at this local vocabulary. But they have a hard ceiling.

A CNN filter only sees a short window at a time. It can tell you what's happening at a given position, but it cannot connect an enhancer 400 kb away to the promoter it regulates. For that, you need something different.

## Building block 2: Transformers as long-range communicators

A transformer's core mechanism is called **self-attention**. Here's the intuition.

Every position in the sequence simultaneously generates three things: a question ("what am I looking for?"), a label ("what do I contain?") and a message ("what do I broadcast if someone's interested?").[8] The model then computes a score between every pair of positions. High score means high attention, one position actively incorporating another's information into its own representation.

<figure class="not-prose my-8 w-full max-w-none" style="width: 100%; margin-left: 0; margin-right: 0;"><img src="/transformer_attention_genomic.png" alt="Positions after CNN compression: enhancer and promoter nodes; arcs from promoter to other positions with thick arc to enhancer indicating strong regulatory attention; Query, Key, Value definitions; output as weighted sum of values" class="w-full max-w-none rounded-lg border border-border shadow-sm" style="width: 100%; max-width: none; display: block; height: auto;" /><figcaption class="mx-auto mt-3 w-full max-w-none text-center text-sm text-muted-foreground">Self-attention after CNN compression: the promoter position attends most strongly to the distal enhancer (line thickness = attention weight). Each position carries Query, Key and Value; outputs are weighted sums of Values.</figcaption></figure>

In genomic terms: this is what lets a promoter "attend to" an enhancer 400 kb away and incorporate its regulatory signal. The model learns which positions are functionally related based purely on patterns in the data, no hard-coded rules about which regulatory elements talk to which.

The limitation is cost. Attention scales quadratically with sequence length. Double the sequence, quadruple the computation. At nucleotide resolution across 1 million base pairs, a transformer running directly is simply not feasible.[7][8]

So you can't just bolt a transformer onto the end of a CNN and call it done.

The architectural insight is how you combine them and that's exactly where AlphaGenome does something novel.

## What comes next

Two building blocks. One fundamental tension. And a model that, on paper, shouldn't be able to do what it does.

In [Part 2: The Architecture, the Model and What It Can Do](/blog/understanding-alphagenome-part-2-architecture), we walk through the U-Net architecture that lets AlphaGenome process 1 million base pairs at single-nucleotide resolution[9], why the compress-then-expand structure is the key insight, how skip connections recover fine-grained detail that would otherwise be lost and what the model's 5,930 output tracks[9] actually predict.

## References

- [1] Weedon MN et al. "Recessive mutations in a distal PTF1A enhancer cause isolated pancreatic agenesis." Nature Genetics, 46, 61–64, 2014. https://doi.org/10.1038/ng.2826
- [2] Bomba L et al. "Decoding Non-coding Variants: Recent Approaches to Studying Their Role in Gene Regulation and Human Diseases." Frontiers in Bioscience, 16(1), 2024. https://doi.org/10.31083/j.fbs1601004
- [3] Sinnott-Armstrong N et al. "The landscape of GWAS validation; systematic review identifying 309 validated non-coding variants across 130 human diseases." BMC Medical Genomics, 15, 2022. https://doi.org/10.1186/s12920-022-01216-w
- [4] Morales J et al. "Understanding the function of regulatory DNA interactions in the interpretation of non-coding GWAS variants." Frontiers in Cell and Developmental Biology, 10, 2022. https://doi.org/10.3389/fcell.2022.957292
- [5] Lambert SA et al. "The Human Transcription Factors." Cell, 172(4), 650–665, 2018. https://doi.org/10.1016/j.cell.2018.01.029
- [6] Kelley DR et al. "Basset: learning the regulatory code of the accessible genome with deep convolutional neural networks." Genome Research, 26(7), 990–999, 2016. https://doi.org/10.1101/gr.200535.115
- [7] Avsec Ž et al. "Effective gene expression prediction from sequence by integrating long-range interactions." Nature Methods, 18, 1196–1203, 2021. https://doi.org/10.1038/s41592-021-01252-x
- [8] Vaswani A et al. "Attention Is All You Need." NeurIPS, 2017. https://arxiv.org/abs/1706.03762
- [9] Avsec Ž et al. "Advancing regulatory variant effect prediction with AlphaGenome." Nature, 2026 (Published 28 January 2026). https://doi.org/10.1038/s41586-025-10014-0`,
    readingTime: 12,
    featured: true,
  },
  {
    slug: "understanding-alphagenome-part-2-architecture",
    title: "Understanding AlphaGenome, Part 2: The Architecture, The Model and What It Can Do",
    description:
      "U-Net DNA, teacher–student distillation, 5,930 tracks, GWAS to T-ALL: how AlphaGenome compresses a megabase, attends globally and scores variants, plus how to run it.",
    date: "2026-03-28",
    author: "Parul Kudtarkar",
    category: "Genomics",
    tags: ["AlphaGenome", "Genomics", "Deep Learning", "U-Net", "Variant interpretation"],
    image: "/images/alphagenome-fig1a-architecture.png",
    hideHeroImage: true,
    content: readBlogMarkdown("understanding-alphagenome-part-2.md"),
    readingTime: 18,
    featured: true,
  },
  {
    slug: "tert-promoter-alphagenome",
    title: "How a Single DNA Letter Change Switches On Cancer's Immortality Engine",
    description:
      "A deep-dive into TERT promoter mutations using AlphaGenome to reconstruct chromatin, TF binding and transcriptional effects from sequence alone.",
    date: "2026-04-22",
    author: "Parul Kudtarkar",
    category: "Genomics",
    tags: ["AlphaGenome", "Genomics", "Cancer", "TERT", "Variant interpretation"],
    image: "/images/tert-alphageome/fig1b_tert_motif_diagram.png",
    hideHeroImage: true,
    content: readBlogMarkdown("tert-promoter-alphagenome.md"),
    readingTime: 14,
    featured: true,
  },
  {
    slug: "tert-alphagenome-notebook-walkthrough",
    title: "TERT AlphaGenome Analysis: A Notebook Walkthrough",
    description:
      "Methods companion to the TERT promoter post: notebook setup, gnomAD control selection, model choice, AlphaGenome API calls, score_variant caveats and evaluation against published biology.",
    date: "2026-04-23",
    author: "Parul Kudtarkar",
    category: "Genomics",
    tags: ["AlphaGenome", "Genomics", "TERT", "Python", "Variant interpretation"],
    image: "/images/tert-alphageome/fig5b_modality_heatmap.png",
    hideHeroImage: true,
    content: readBlogMarkdown("tert-alphagenome-notebook-walkthrough.md"),
    readingTime: 30,
    featured: true,
  },
  {
    slug: "alphagenome-coverage-explorer",
    title: "AlphaGenome Coverage Explorer: Check Training Data Coverage Before You Run the Model",
    description:
      "A practical tool to check whether your tissue or cell type is covered in AlphaGenome training tracks before you run variant effect analyses.",
    date: "2026-04-01",
    author: "Parul Kudtarkar",
    category: "Genomics",
    tags: ["AlphaGenome", "Genomics", "Variant interpretation", "Tooling"],
    image: "/images/alphagenome-coverage-explorer.png",
    hideHeroImage: true,
    content: readBlogMarkdown("alphagenome-coverage-explorer.md"),
    readingTime: 5,
    featured: true,
  },
  {
    slug: "essential-toolkit-building-ai-agents-2026",
    title: "The Essential Toolkit for Building AI Agents in 2026",
    description: "What I learned building agents for the past two years. A practical guide to the frameworks, tools and patterns that actually work.",
    date: "2026-01-08",
    author: "Parul Kudtarkar",
    category: "AI",
    tags: ["AI", "LangChain", "LangGraph", "Machine Learning", "Development"],
    image: "/ai_agent_toolkit.webp",
    content: `
**What I learned building agents for the past two years**

Two years ago, a friend introduced me to LangChain. I was immediately hooked; here was a framework that let LLMs do things they couldn't do on their own. Live web search. Calling external tools. Querying databases. Back then, LLMs were just text completion engines. LangChain opened up a whole new world of possibilities.

I dove in deep. Took a comprehensive course, spent weeks in the documentation and most importantly, kept building. From simple document Q&A bots to complex research agents navigating knowledge graphs.

Here's what I've learned works, what doesn't and what you actually need to know.

## **The foundation: Frameworks**

### **LangChain: Where I started (and where you should too)**

The course I took walked through building agents at every level of sophistication. But the real learning came from building projects where I needed agents to orchestrate database queries, web searches and data validation in complex workflows.

Here's what I learned: LangChain is the React of AI development-opinionated, occasionally frustrating, but ultimately the right choice because the ecosystem has converged around it.

**What it actually does:**

- Connects LLMs (Claude, GPT, etc.) to your data sources

- Manages conversation history so your AI doesn't have amnesia

- Provides pre-built integrations for common tools

- Gives LLMs the ability to call external APIs, search engines, databases

- Handles the plumbing you don't want to write yourself

### **LangGraph: When LangChain stops being enough**

After building several agents with LangChain, I hit cases where I needed:

- Conditional decisions based on intermediate results

- Loops that verify and retry

- Complex multi-step reasoning with branching paths

That's when LangGraph became essential.

**The difference:** LangChain follows a linear path. LangGraph handles conditional branches and complex decision trees.

**When you need it:** When your agent's logic becomes a flowchart with conditional branches. When you find yourself hacking around LangChain's linear structure.

**When you don't:** For your first few agents. Build simpler things first, understand the patterns, then graduate to LangGraph.

## **Development tools I rely on**

### **LangSmith: The debugger that saves hours**

Debugging AI agents without LangSmith is like debugging web apps without browser DevTools. You're flying blind.

**What you actually see:**

- Which documents your RAG retrieved (and why it picked certain ones)

- The exact prompt sent to the LLM (often different from what you expected)

- Cost per request (important when you're making hundreds of calls)

- Latency breakdown (where time is actually spent)

- Failure points (without this, debugging takes forever)

**When to use it:** Day one. Don't wait until you have problems. The traces help you understand what's working too.

### **Pydantic: Catch errors before production**

LLMs return text. Sometimes that text is malformed JSON. Sometimes it's the wrong data type. Sometimes it's just garbage.

Pydantic catches this immediately:

\`\`\`python

class ResearchPaper(BaseModel):

    title: str

    authors: list[str]  # Enforces this is a list

    year: int

# This explodes if the LLM returns bad data

paper = ResearchPaper.model_validate_json(llm_response)

\`\`\`

**When you need it:** Before any structured data hits your system. In production, this is non-negotiable.

## **Specialized tools that unlock capabilities**

### **Vector Databases: Semantic search that actually works**

Traditional databases search for exact keyword matches. Vector databases search for *meaning*.

Search "heart attack" → finds documents about "myocardial infarction"  

Search "cheap flights" → finds "budget airlines" and "discount travel"

\`\`\`python

# Store documents

vectorstore.add_documents(chunks)

# Search by meaning

results = vectorstore.similarity_search(

    "cheap flights",

    k=5

)

\`\`\`

**Popular options:**

- **Pinecone**: Easiest to start, generous free tier

- **Weaviate**: Open source, more control

- **Chroma**: Runs locally, perfect for prototyping

**When you need it:** Any RAG application where semantic search matters more than exact keyword matching.

### **Tavily: Web search built for AI agents**

Your agent needs current information. Stock prices, news, API docs that changed yesterday, research papers published last week.

**What makes it different:** Traditional search APIs return raw HTML. Tavily returns content already cleaned and formatted for LLMs-no ads, no navigation, just the content your agent needs.

\`\`\`python

from tavily import TavilyClient

tavily = TavilyClient(api_key="your-key")

response = tavily.search(

    "latest AI research January 2026",

    search_depth="advanced",

    time_range="month",

    include_answer=True

)

\`\`\`

**When you need it:** Research agents, fact-checking, monitoring, anything requiring current information beyond your training data.

### **Neo4j: When relationships matter**

For some problems, data isn't just documents-it's entities and relationships. That's where graph databases shine.

**When you need it:** When your data is naturally relational and you need to traverse connections. Not for simple document search; use vector databases for that.

### **LLM Guard: Security before launch**

Production AI without security is asking for trouble.

**What you're protecting against:**

- Prompt injection ("ignore previous instructions...")

- Data leaks (API keys, customer data)

- Jailbreaks (bypassing safety rails)

- PII exposure

\`\`\`python

from llm_guard import scan_prompt, scan_output

# Before sending to LLM

sanitized_prompt, is_valid = scan_prompt(user_input)

if not is_valid:

    return "I can't process that request."

# After receiving from LLM

sanitized_output, is_safe = scan_output(llm_response)

\`\`\`

**When you need it:** Before anything customer-facing goes live. Not optional.

## **A real example: Building a biomedical research platform**

Let me show you what these tools look like working together. I built a platform for biomedical research that helps navigate complex relationships in scientific data-the kind of problem where entities (genes, diseases, drugs, variants) are all interconnected.

**The technical challenge:**  

Users needed to ask complex questions that required traversing multiple relationships: "If variant X affects gene Y and gene Y is in pathway Z, what drugs target that pathway?"

This isn't a simple document search. It's multi-hop reasoning across connected data.

**The architecture:**

**Neo4j as the backbone:**  

Stored relationships between biological entities:

\`\`\`

Variant -[AFFECTS]-> Gene

Gene -[IN_PATHWAY]-> Pathway

Drug -[TARGETS]-> Gene

Gene -[ASSOCIATED_WITH]-> Disease

\`\`\`

Why Neo4j? Traditional databases would need 4+ JOIN operations for these queries. Neo4j makes relationship traversal natural and fast.

**LangGraph for orchestration:**  

Built a multi-step agent workflow:

1. Parse user question

2. Query graph database for relevant entities

3. Traverse relationships to find connections

4. Synthesize findings into answer

Each step could branch based on what was found. If step 2 found multiple genes, step 3 needed to handle them differently. LangChain's linear chains couldn't handle this; LangGraph could.

**Pydantic everywhere:**  

Every database query returns structured data that gets validated:

\`\`\`python

class GenePathway(BaseModel):

    gene_symbol: str

    pathway_name: str

    evidence_sources: list[str]

# Validate before passing to LLM

result = GenePathway.model_validate(neo4j_response)

\`\`\`

This catches data issues early-critical when dealing with scientific data.

**LangSmith for debugging:**  

With multi-step workflows hitting multiple systems, debugging was brutal initially. LangSmith showed:

- Which graph queries executed

- Which web searches ran

- Where the agent made wrong decisions

- Why certain paths were chosen

**What this demonstrates:**  

Your application will look different-maybe you're building a legal research tool, a customer support system, or something else entirely. But the patterns are similar: complex data relationships, multi-step reasoning, validation against external sources.

## **The golden rule**

Use the simplest thing that works.

- Don't use GPT-4 if GPT-3.5 solves it

- Don't fine-tune if prompt engineering works

- Don't build an agent if simple RAG is enough

- Don't use LangGraph if LangChain suffices

## **The bottom line**

I've spent two years building AI agents from simple chatbots to production systems handling complex workflows in research environments.

Here's what I know: the teams winning aren't using the fanciest tools. They're solving real problems with the right combination of tools.

Start simple. Build something that works. Get it in front of users. Learn what breaks. Fix it. Repeat.

**The toolkit is here. The question is: what are you going to build?**`,
    readingTime: 12,
    featured: true,
    audioUrl: "/audio/essential-toolkit-building-ai-agents-2026.mp3",
  },
  {
    slug: "welcome-to-my-blog",
    title: "Welcome to My Blog",
    description: "I'm excited to share insights about AI, genomics and research. This is the beginning of a journey to document my learnings and discoveries.",
    date: "2026-01-08",
    author: "Parul Kudtarkar",
    category: "General",
    tags: ["AI", "Research"],
    content: `# Welcome to My Blog

I'm thrilled to launch this blog where I'll be sharing insights about artificial intelligence, genomics and research. 

## What to Expect

In this space, I'll cover:
- **AI & Machine Learning**: Latest developments, techniques and applications
- **Genomics Research**: Discoveries in disease research and drug discovery
- **Technology**: Tools and frameworks that make research more effective

## About Me
I'm a bioinformatics leader with 20 years of experience building AI-powered platforms that transform genomic data into therapeutic insights. As a generalist who bridges the gap between software engineering and life sciences, I've led large-scale initiatives at Caltech, UCSD and Harvard Medical School. Educated at Northeastern University, my work spans cloud computing, machine learning and single-cell genomics to understand disease etiology and accelerate drug discovery.
Stay tuned for more content!`,
    readingTime: 2,
    featured: true,
    audioUrl: "/audio/welcome-to-my-blog.mp3",
  },
  {
    slug: "ai-task-augmentation",
    title: "I ran every task in a bioinformatics job description through an AI risk model. Here's the breakdown.",
    description:
      "A data-driven analysis of AI augmentation potential across computational biology and life sciences, using Anthropic's labor market data, 176 job descriptions and a live test on my own role.",
    date: "2026-03-15",
    author: "Parul Kudtarkar",
    category: "AI",
    tags: ["AI Task Augmentation", "life sciences"],
    image: "/ai-automation-risk-thumbnail.webp",
    content: readBlogMarkdown("ai-task-augmentation.md"),
  },
]

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags?.includes(tag)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map(post => post.category).filter((cat): cat is string => Boolean(cat)))
  return Array.from(categories).sort()
}

export function getAllTags(): string[] {
  const tags = new Set(blogPosts.flatMap(post => post.tags || []))
  return Array.from(tags).sort()
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}


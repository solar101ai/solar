import React, { useMemo, useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Typewriter from "./Typewriter";

/* ===========
   设置 / Settings
=========== */
const SETTINGS = {
  brandName: "Solar101 AI",
  market: "加利福尼亚 / California",
  wechatId: "Uscleanenergy123",
  smsNumber: "+12134589525",
};

/* ===========
   集成配置 / Integration Config
   只改这里就行 / Only change here
=========== */
const INTEGRATIONS = {
  zapierHookUrl: "https://hooks.zapier.com/hooks/catch/11896107/uqat845/",
  uploadcarePublicKey: "a78e71a92a6aea20714f",
  source: "solar101_webapp",
};

/* ===========
   多语言内容 / Multilingual Content
=========== */
const TRANSLATIONS = {
  zh: {
    nav: {
      home: "首页",
      estimate: "估算",
      ask: "提问",
    },
    languageSelect: {
      title: "选择语言",
      subtitle: "Choose Your Language",
      chinese: "中文",
      english: "English",
    },
    home: {
      hero: {
        title: "装太阳能之前\n先确认你是不是能真的省钱",
        subtitle: "Solar101 AI 小满客观判断，只回答值不值得装。\n你不需要懂太阳能，我先替你把不合适的情况筛掉。",
        cta: "用 AI 判断我能不能省钱（1 分钟）",
        badge: "不适合会直说",
        badgeSubtitle: "帮你省时间",
      },
      intro: "你可以先做 1 分钟判断，\n或者先点下面这些关键问题，快速搞清楚是不是值得继续。",
      topQuestions: "Top 问题",
      ctaButton: "让我用 AI 判断我能不能省钱",
      ctaSubtitle: "只要 1 分钟，不会触发销售联系。",
      askSection: {
        title: "也可以直接问我",
        placeholder: "在这里输入你的问题",
        example: "例如：我电费 200 划算吗？为什么别人都说拿不到 ITC？",
        send: "发送",
        tip: "不想打字也行，直接点上面的 Top 问题就能开始。",
      },
    },
    estimate: {
      title: "估算",
      billPlaceholder: "每月电费大约多少",
      zipPlaceholder: "ZIP（可选）",
      zipHint: "帮小满判断，你大概属于哪种用电水平。",
      result: "每月可能省 ${{low}} 到 ${{high}}",
      continue: "继续判断",
      requireBill: "先输入每月电费后再继续。",
    },
    deepdive: {
      title: "继续判断",
      receivedInfo: "小满已收到的信息",
      receivedDetails: "小满先确认一下我目前掌握的信息：\n• 你的每月电费大约在 ${{bill}} 左右\n• 用电水平：已结合当地情况初步判断\n\n如果有不准确的地方，你可以随时修改。",
      monthlyBill: "每月电费（可修改）",
      zipCode: "ZIP（可修改，可选）",
      disclaimer: "下面这几个问题，不是为了推荐方案，而是为了避免你被不适合你的方案浪费时间。",
      ownerQuestion: "你目前是房屋所有人吗？",
      ownerHint: "太阳能的决策权，通常只在房屋所有人手里，所以我需要确认你是否具备继续评估的前提条件。",
      yes: "是",
      no: "否 / 不确定",
      usageQuestion: "你的用电主要集中在？",
      usageHint: "因为加州现在的电价结构，白天和晚上的价值差别很大，这会直接影响太阳能是否真的帮你省钱。",
      day: "白天",
      night: "晚上",
      unknown: "不确定",
      uploadTitle: "让我的判断更贴近你的真实情况（可选）",
      uploadHint: "目前我的判断，是基于常见用电模型和你刚才提供的信息。\n如果你愿意上传一张最近的电费单，我可以把判断从「大致合理」变成「更贴近你实际情况」。",
      uploadDisclaimer: "仅用于判断是否适合继续评估，不会自动触发销售联系。不上传也可以继续。",
      computing: "小满正在计算",
      computingSteps: {
        step1: "小满正在读取你的用电画像",
        step2: "正在结合加州电价结构和常见系统边界",
        step3: "正在检查你是否具备继续评估的基础条件",
        step4: "正在生成判断结论",
      },
      decisions: {
        level1: {
          title: "小满判断：当前阶段适合谨慎评估",
          content: "从目前信息来看，你的用电规模相对较小。\n这意味着太阳能是否值得继续，需要更谨慎地判断，不建议直接推进方案。\n如果你愿意，我可以基于你更完整的数据帮你把风险和收益拆清楚。",
        },
        level2: {
          title: "小满判断：值得继续往下做更细节的评估",
          content: "基于你目前提供的信息，你具备继续评估太阳能的基础条件。\n下一步我会站在\"是否真的对你划算\"的角度，把关键变量拆清楚，避免你被不适合你的方案浪费时间。",
        },
        level3: {
          title: "小满判断：当前阶段不适合继续推进",
          content: "基于你目前提供的信息，继续做太阳能评估，实际可落地的空间非常有限。\n这类情况下，继续往下走往往更容易消耗时间精力，而很难换来对应的收益。\n当你的用电规模、居住条件或决策环境发生变化时，再回来让我重新判断，会更理性。",
        },
        cta: "我需要一个更细节的方案",
      },
    },
    collect: {
      title: "下一步",
      analyzing: "小满需要一点时间做系统分析",
      analyzingHint: "我会把你的情况整理成一个更细节的方案，然后发给你。",
      contactTitle: "我怎么把结果发给你？",
      contactHint: "你可以选择短信或微信，二选一即可。",
      analyzing2: "小满正在继续判断",
      analyzingDetails: "• 你的用电量\n• 所在地区的电价情况\n• 地址对应的阳光和屋顶条件\n• 当前可用的政策和方案",
      goal: "目标只有一件事：把钱省到最多。",
      resultNote: "判断完成后，会发给你。",
      namePlaceholder: "你的姓名",
      sms: "短信",
      wechat: "微信",
      phonePlaceholder: "手机号",
      phoneHint: "我会用短信把你的分析结果发给你。",
      wechatPlaceholder: "你的微信号",
      wechatHint: "我会通过微信把你的分析结果发给你。",
      submit: "发送给小满",
      submitting: "发送中...",
      successAlert: "已收到。\n判断正在进行中，\n结果将在 24 到 48 小时内生成并发送。",
      successNote: "已经提交成功，小满会在24到48小时之内用你选择的方式联系你。",
      errors: {
        name: "请先填写姓名",
        phone: "请选择短信时需要填写手机号",
        wechat: "请选择微信时需要填写微信号",
      },
    },
    ask: {
      title: "提问",
      you: "你",
      ai: "AI",
      placeholder: "输入你的问题",
      send: "发送",
      fallback: "这个问题需要真人确认，建议直接联系我们。",
    },
    contact: {
      title: "联系真人",
      sms: "短信联系",
      wechat: "微信：",
    },
    upload: {
      selected: "已选择：",
      uploading: "正在上传中...",
      success: "上传成功：已生成文件链接",
    },
  },
  en: {
    nav: {
      home: "Home",
      estimate: "Estimate",
      ask: "Ask",
    },
    languageSelect: {
      title: "Choose Your Language",
      subtitle: "选择语言",
      chinese: "中文 (Chinese)",
      english: "English",
    },
    home: {
      hero: {
        title: "Before Installing Solar\nFind Out If You'll Actually Save Money",
        subtitle: "Solar101 AI gives you an objective assessment. No fluff, just facts.\n\nYou don't need to understand solar—I'll filter out unsuitable situations first.",
        cta: "Use AI to Check If I Can Save (1 min)",
        badge: "I'll Tell You If It Won't Work",
        badgeSubtitle: "Save your time",
      },
      intro: "You can do a 1-minute assessment first,\n\nor click the key questions below to quickly understand if it's worth continuing.",
      topQuestions: "Top Questions",
      ctaButton: "Let AI Check If I Can Save Money",
      ctaSubtitle: "Takes 1 minute. Won't trigger sales contact.",
      askSection: {
        title: "Or Just Ask Me Directly",
        placeholder: "Type your question here",
        example: "e.g., Is $200/month worth it? Why can't people get the ITC?",
        send: "Send",
        tip: "Don't want to type? Just click the Top Questions above to get started.",
      },
    },
    estimate: {
      title: "Estimate",
      billPlaceholder: "Monthly electricity bill (approx.)",
      zipPlaceholder: "ZIP Code (optional)",
      zipHint: "Helps determine your electricity usage level.",
      result: "You could save ${{low}} to ${{high}} per month",
      continue: "Continue Assessment",
      requireBill: "Please enter your monthly bill first.",
    },
    deepdive: {
      title: "Continue Assessment",
      receivedInfo: "Information I Have So Far",
      receivedDetails: "Let me confirm the information I have:\n• Your monthly bill is around ${{bill}}\n• Usage level: assessed based on local conditions\n\nYou can update any information if it's not accurate.",
      monthlyBill: "Monthly Bill (editable)",
      zipCode: "ZIP Code (editable, optional)",
      disclaimer: "These questions aren't to sell you anything—they're to avoid wasting your time on unsuitable options.",
      ownerQuestion: "Are you the homeowner?",
      ownerHint: "Solar decisions typically require homeowner authority, so I need to confirm you meet this prerequisite.",
      yes: "Yes",
      no: "No / Not Sure",
      usageQuestion: "When do you use most electricity?",
      usageHint: "California's electricity pricing varies significantly between day and night, which directly affects whether solar will actually save you money.",
      day: "Daytime",
      night: "Evening",
      unknown: "Not Sure",
      uploadTitle: "Make My Assessment More Accurate (Optional)",
      uploadHint: "My current assessment is based on typical usage patterns and your provided information.\nIf you upload a recent electricity bill, I can make the assessment more tailored to your actual situation.",
      uploadDisclaimer: "Only used for assessment. Won't trigger sales contact. You can continue without uploading.",
      computing: "Analyzing Your Information",
      computingSteps: {
        step1: "Reading your electricity usage profile",
        step2: "Analyzing California pricing structure and system parameters",
        step3: "Checking if you meet the baseline criteria for evaluation",
        step4: "Generating assessment conclusion",
      },
      decisions: {
        level1: {
          title: "Assessment: Proceed with Caution",
          content: "Based on current information, your electricity usage is relatively low.\nThis means whether solar is worthwhile requires more careful evaluation—I don't recommend rushing into a plan.\nIf you'd like, I can break down the risks and benefits based on more complete data.",
        },
        level2: {
          title: "Assessment: Worth Detailed Evaluation",
          content: "Based on your provided information, you meet the baseline criteria for solar evaluation.\nNext, I'll break down the key variables from the perspective of 'is this actually cost-effective for you,' to avoid wasting time on unsuitable plans.",
        },
        level3: {
          title: "Assessment: Not Recommended to Proceed",
          content: "Based on your current information, there's very limited viable space for solar evaluation.\nIn such cases, continuing often consumes time and energy with minimal corresponding benefit.\nWhen your usage scale, living situation, or decision environment changes, come back for a fresh assessment—that would be more rational.",
        },
        cta: "I Need a Detailed Plan",
      },
    },
    collect: {
      title: "Next Steps",
      analyzing: "I Need Time for System Analysis",
      analyzingHint: "I'll organize your situation into a detailed plan and send it to you.",
      contactTitle: "How Should I Send You the Results?",
      contactHint: "You can choose SMS or WeChat—just pick one.",
      analyzing2: "Continuing Assessment",
      analyzingDetails: "• Your electricity usage\n• Regional electricity pricing\n• Sunlight and roof conditions for your address\n• Currently available policies and programs",
      goal: "One goal: maximize your savings.",
      resultNote: "You'll receive the results when complete.",
      namePlaceholder: "Your Name",
      sms: "SMS",
      wechat: "WeChat",
      phonePlaceholder: "Phone Number",
      phoneHint: "I'll send your analysis results via SMS.",
      wechatPlaceholder: "Your WeChat ID",
      wechatHint: "I'll send your analysis results via WeChat.",
      submit: "Send to Solar101 AI",
      submitting: "Sending...",
      successAlert: "Received.\nAssessment in progress.\nResults will be sent within 24-48 hours.",
      successNote: "Successfully submitted. You'll receive results via your chosen method within 24-48 hours.",
      errors: {
        name: "Please enter your name",
        phone: "Phone number required when choosing SMS",
        wechat: "WeChat ID required when choosing WeChat",
      },
    },
    ask: {
      title: "Ask",
      you: "You",
      ai: "AI",
      placeholder: "Type your question",
      send: "Send",
      fallback: "This question requires human verification. Please contact us directly.",
    },
    contact: {
      title: "Contact Human",
      sms: "Text Us",
      wechat: "WeChat:",
    },
    upload: {
      selected: "Selected:",
      uploading: "Uploading...",
      success: "Upload successful: file link generated",
    },
  },
};

/* ===========
   已审批问答 / Approved Q&A (Bilingual)
=========== */
const APPROVED_QA = {
  zh: [
    {
      id: "qa_1",
      question: "装太阳能到底能不能省钱？",
      answer: `\n 一、太阳能是怎么变成"省钱工具"的？
最早的太阳能，是科研级和高成本技术，只有少数人用得起。
但随着技术成熟和规模化生产，这十多年里，太阳能发电成本快速下降，
已经从"昂贵替代能源"，变成了全球最便宜的发电方式之一。

换句话说：
👉 今天装太阳能，不再是"为了环保多花钱"
👉 而是开始具备"经济合理性"的能源选择。

二、当下电费的现实：为什么越来越多人开始考虑太阳能？
与此同时，电价却在走相反的方向。
在加州和全美大多数地区：

电费在过去十多年里持续上涨
峰谷电价差距拉大
固定费用和结构性收费越来越复杂

这意味着：
👉 就算你用电量没变，你的账单也可能年年变高
👉 用电成本的不可控性，正在成为很多家庭的压力来源

太阳能的价值，正是在这种背景下被放大出来的：
你不是在买一套设备，而是在锁定一部分未来用电成本。

三、大多数装了太阳能的人，真的省了多少钱？
现实中，装了太阳能的家庭，节省幅度差异非常大，但有几个可参考的范围：
很多家庭的电费支出可以降低 30% 到 70%
在用电量高、屋顶条件好、系统设计合理的情况下
有些家庭可以接近"覆盖大部分用电"
一些家庭通过电价套利和储能配合，在高电价时段显著减少电网用电

但同样要说明：
👉 不是每个人都能"接近零电费"
👉 省多少，取决于用电结构、屋顶条件、电价体系、系统设计是否合理

所以，"省钱"本身不是绝对的，
而是一个高度取决于个人条件的结果。

四、那到底值不值得装？
真正的问题不是：
❌ 太阳能能不能省钱
而是：
✅ 在你的具体条件下，太阳能值不值得装

这也是 Solar101 AI 存在的意义：
不是给你一个统一答案，
而是判断你是否具备省钱的可能性、风险在哪里、是否值得继续算。`,
    },
    {
      id: "qa_2",
      question: "我家适不适合装太阳能？",
      answer: `很多人问"适不适合"，其实是在问：
👉 我的房子会不会是那种一开始就不该装的情况？

一、为什么不是所有房子都适合？
太阳能并不是一个"只要有屋顶就行"的东西。
现实中，确实存在一些结构性限制：

有的屋顶遮挡过多
有的有效可用面积不足
有的用电结构与发电曲线严重不匹配

这些情况不是靠销售话术能解决的。

二、真正影响"适不适合"的是什么？
是否适合，核心不在于某一个条件，而在于组合结果，包括：
屋顶可用性
用电量是否达到有意义的区间
用电时间是否集中在高价时段
系统是否有合理设计空间

只要其中几个关键条件不成立，
即便勉强装上，效果也往往不理想。

三、为什么要先筛掉"不适合"的？
因为很多问题，一旦进入设计或签约阶段，就已经来不及回头。
Solar101 AI 会在最前面就帮你判断：
👉 有没有明显硬伤
👉 是否值得继续深入评估
👉 哪些情况反而应该直接停下

适合不适合，应该先被判断清楚，而不是事后才发现。`,
    },
    {
      id: "qa_3",
      question: "AI 是怎么帮我算太阳能省钱的？",
      answer: `很多人以为"算省钱"，就是给一个数字。
但真实的判断过程远比一个数字复杂。

一、从什么开始算？
Solar101 AI 的起点不是"你能省多少"，
而是先判断你的用电是否已经进入"有计算意义"的区间。

如果连基础前提都不成立，
后面的计算本身就没有参考价值。

二、AI 实际在做什么判断？
在估算过程中，AI 会综合考虑：
你的电费区间
当地电价结构和峰谷差
NEM 规则下不同时段的用电价值
常见系统成本和设计范围

这些因素并不会给出一个绝对答案，
而是形成一个合理的区间判断。

三、为什么要明确假设？
任何估算都建立在假设之上。
Solar101 AI 会明确告诉你：
哪些是假设
哪些信息缺失可能会影响结果
哪些情况会让结果变得不成立

这样你看到的不是一个"看起来很美"的数字，
而是一套可以被理解和质疑的判断过程。`,
    },
    {
      id: "qa_4",
      question: "AI 的估算和销售给我的有什么不同？",
      answer: `最大的不同在于：出发点不一样。

一、销售在做什么？
销售的目标通常是：
展示最有利的情景
强调最好看的结果
尽快推进成交

这并不一定是恶意，
但很少有人会在一开始就把不利条件讲清楚。

二、Solar101 AI 在做什么？
AI 的第一步不是推荐方案，
而是判断：
👉 值不值得继续
👉 风险在哪里
👉 哪些假设过于乐观

如果条件本身不成立，
AI 会直接指出，而不是绕过去。

三、为什么这一步很重要？
因为一旦进入合同和施工阶段，
很多问题就已经无法逆转。

AI 的价值不在于让你"更想装"，
而在于帮你避免走进一个一开始就不理性的路径。`,
    },
    {
      id: "qa_5",
      question: "现在还能不能拿到 ITC？为什么很多人拿不到？",
      answer: `先说结论：
对大多数普通家庭来说，现在直接拿到完整 30% 联邦 ITC 退税，
已经不再是"默认存在"的事情了。

一、政策为什么发生了变化？
过去，《削减通胀法案（IRA）》确实为住宅太阳能提供了 30% 的联邦税收抵免，
这一政策原本计划持续多年。
但在后续相关法案调整中，
住宅端的 30% ITC 实际上被提前终止或大幅收紧。

这意味着：
👉 "装太阳能就一定有 30% 退税"的时代已经结束
👉 是否还能拿到 ITC，变成了一个需要具体判断的问题

二、是不是完全没机会了？
并不是。

在特定区域、满足特定能源和用地结构要求的情况下，
仍然存在通过 Energy Community 等政策资格路径，
实现接近或等同于 30% 退税效果的可能性。

需要说明的是：
Energy Community 不是某一家公司，
而是联邦政策中针对特定地区和能源结构设立的资格类别。

三、为什么很多人现在"拿不到" ITC？
真正的原因往往不是被拒，
而是从一开始选择的项目路径，就不具备退税资格。

很多项目：
所在区域不符合政策定义
用地或能源结构不符合要求
项目设计时没有走可退税的合规路径

在这种情况下，
即便系统顺利装好，也根本不具备申请退税的基础条件。

所以问题不是"政府不给退税"，
而是：
👉 很多项目，从一开始就不是能退税的那一类。

而这，正是 Solar101 AI 要提前帮你判断清楚的部分。`,
    },
  ],
  en: [
    {
      id: "qa_1",
      question: "Can Solar Actually Save Me Money?",
      answer: `\n I. How Did Solar Become a "Money-Saving Tool"?
Early solar was research-grade, high-cost technology that only a few could afford.
But with technological maturity and scaled production over the past decade, solar generation costs have dropped rapidly,
transforming from "expensive alternative energy" to one of the world's cheapest electricity generation methods.

In other words:
👉 Installing solar today is no longer "spending more for the environment"
👉 It's become an energy choice with "economic rationale"

II. Today's Electricity Reality: Why Are More People Considering Solar?
Meanwhile, electricity prices are moving in the opposite direction.
In California and most of the US:

Electricity rates have risen continuously over the past decade
Peak and off-peak price gaps have widened
Fixed fees and structural charges are increasingly complex

This means:
👉 Even if your usage stays the same, your bill may increase annually
👉 The uncontrollability of electricity costs is becoming a source of stress for many households

Solar's value is amplified in this context:
You're not buying equipment—you're locking in a portion of your future electricity costs.

III. How Much Do People Actually Save with Solar?
In reality, savings vary greatly among solar-equipped households, but here are some reference ranges:
Many households reduce electricity expenses by 30% to 70%
With high usage, good roof conditions, and well-designed systems
Some households can approach "covering most electricity needs"
Some households, through price arbitrage and battery storage, significantly reduce grid usage during high-rate periods

But it must be said:
👉 Not everyone can achieve "near-zero electricity bills"
👉 Savings depend on usage structure, roof conditions, pricing system, and system design quality

So "saving money" isn't absolute—
it's a result highly dependent on individual circumstances.

IV. So Is It Worth Installing?
The real question isn't:
❌ Can solar save money
But:
✅ Under your specific circumstances, is solar worth installing

This is why Solar101 AI exists:
Not to give you a universal answer,
but to determine if you have money-saving potential, where the risks are, and whether it's worth continuing the evaluation.`,
    },
    {
      id: "qa_2",
      question: "Is My Home Suitable for Solar?",
      answer: `When people ask "is it suitable," they're really asking:
👉 Is my house one of those cases that shouldn't have solar from the start?

I. Why Aren't All Houses Suitable?
Solar isn't a "just needs a roof" thing.
In reality, there are structural limitations:

Some roofs have excessive shading
Some lack sufficient usable area
Some have usage patterns severely mismatched with generation curves

These situations can't be solved by sales pitches.

II. What Really Affects "Suitability"?
Suitability isn't about any single condition, but the combination, including:
Roof usability
Whether usage reaches a meaningful range
Whether usage concentrates during high-rate periods
Whether there's reasonable design space for the system

If several key conditions don't hold,
even if forcibly installed, results are often unsatisfactory.

III. Why Filter Out "Unsuitable" Cases First?
Because many problems, once you enter design or contracting stages, are already too late to reverse.
Solar101 AI will help you determine upfront:
👉 Are there obvious deal-breakers
👉 Is it worth deeper evaluation
👉 Which situations should you just stop

Suitability should be determined first, not discovered afterward.`,
    },
    {
      id: "qa_3",
      question: "How Does AI Calculate Solar Savings for Me?",
      answer: `Many think "calculating savings" means giving a number.
But the real assessment process is far more complex than a number.

I. Where Does It Start?
Solar101 AI's starting point isn't "how much you'll save,"
but first determining if your electricity usage has entered a "calculation-worthy" range.

If the basic premise doesn't hold,
the subsequent calculation itself has no reference value.

II. What Judgments Is the AI Actually Making?
During estimation, the AI comprehensively considers:
Your electricity bill range
Local pricing structure and peak-valley differences
Usage value across different time periods under NEM rules
Common system costs and design ranges

These factors don't produce an absolute answer,
but form a reasonable range assessment.

III. Why Make Assumptions Explicit?
Any estimate is built on assumptions.
Solar101 AI will explicitly tell you:
What the assumptions are
What missing information might affect results
What circumstances would invalidate the results

This way you don't see a "looks beautiful" number,
but a judgment process that can be understood and questioned.`,
    },
    {
      id: "qa_4",
      question: "How Is AI's Estimate Different from a Salesperson's?",
      answer: `The biggest difference: different starting points.

I. What Is a Salesperson Doing?
A salesperson's goals typically are:
Show the most favorable scenario
Emphasize the best-looking results
Push toward closing quickly

This isn't necessarily malicious,
but few will clearly explain unfavorable conditions upfront.

II. What Is Solar101 AI Doing?
The AI's first step isn't recommending a plan,
but determining:
👉 Is it worth continuing
👉 Where are the risks
👉 Which assumptions are too optimistic

If conditions don't hold,
the AI will point it out directly, not bypass it.

III. Why Is This Step Important?
Because once you enter contract and installation stages,
many problems can't be reversed.

The AI's value isn't making you "want to install more,"
but helping you avoid entering an irrational path from the start.`,
    },
    {
      id: "qa_5",
      question: "Can I Still Get the ITC? Why Can't Many People Get It?",
      answer: `Bottom line first:
For most ordinary households, directly getting the full 30% federal ITC tax credit
is no longer a "default given" anymore.

I. Why Did the Policy Change?
Previously, the Inflation Reduction Act (IRA) did provide a 30% federal tax credit for residential solar,
a policy originally planned to last many years.
But in subsequent legislative adjustments,
the residential 30% ITC was effectively terminated early or significantly tightened.

This means:
👉 The era of "install solar and automatically get 30% back" is over
👉 Whether you can still get the ITC has become a case-by-case determination

II. Is There No Chance at All?
Not quite.

In specific regions, meeting specific energy and land structure requirements,
there are still paths through qualifications like Energy Community
to achieve near or equivalent to 30% tax credit effects.

To clarify:
Energy Community isn't a company,
but a qualification category established in federal policy for specific regions and energy structures.

III. Why Can't Many People Get the ITC Now?
The real reason often isn't rejection,
but that from the start, the project path they chose doesn't qualify for the tax credit.

Many projects:
Are in regions that don't meet policy definitions
Have land or energy structures that don't meet requirements
Weren't designed through a compliant, credit-eligible path

In such cases,
even if the system is successfully installed, there's simply no basis for applying for the tax credit.

So the issue isn't "the government won't give credits,"
but:
👉 Many projects, from the start, weren't the type that could get credits.

And this is exactly what Solar101 AI helps you determine upfront.`,
    },
  ],
};

/* ===========
   语言上下文 / Language Context
=========== */
const LanguageContext = React.createContext();

function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || null;
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.zh;
  const qa = APPROVED_QA[language] || APPROVED_QA.zh;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, qa }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ===========
   工具 / Tools
=========== */
function toE164US(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

function smsHref(phone, body) {
  const e164 = toE164US(phone);
  if (!e164) return "sms:";
  const b = body ? `?&body=${encodeURIComponent(body)}` : "";
  return `sms:${e164}${b}`;
}

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function overlapScore(a, b) {
  const sa = new Set(normalize(a).split(" ").filter(Boolean));
  const sb = new Set(normalize(b).split(" ").filter(Boolean));
  if (!sa.size || !sb.size) return 0;
  let hit = 0;
  sa.forEach((w) => sb.has(w) && hit++);
  return hit / Math.max(sa.size, sb.size);
}

function zipSeed(zip) {
  if (!zip) return null;
  let h = 0;
  for (let i = 0; i < zip.length; i++) {
    h = zip.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h);
}

function zipRand(zip, min, max) {
  const seed = zipSeed(zip);
  if (seed === null) return null;
  const r = (seed % 1000) / 1000;
  return min + r * (max - min);
}

/* ===========
   新增: 时间, Uploadcare, Zapier
=========== */
function nowISO() {
  return new Date().toISOString();
}

async function uploadToUploadcare(file, publicKey) {
  if (!file) return { fileUrl: "", uuid: "" };

  const form = new FormData();
  form.append("UPLOADCARE_PUB_KEY", publicKey);
  form.append("UPLOADCARE_STORE", "auto");
  form.append("file", file);

  const resp = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: form,
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`Uploadcare upload failed: ${resp.status} ${txt}`);
  }

  const data = await resp.json();
  const uuid = data?.file;
  if (!uuid) throw new Error("Uploadcare response missing file uuid");

  return {
    uuid,
    fileUrl: `https://ucarecdn.com/${uuid}/`,
  };
}

async function sendToZapier(payload) {
  const url = INTEGRATIONS.zapierHookUrl;
  if (!url) throw new Error("Missing Zapier Hook URL");

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
  });

  return true;
}

/* ===========
   UI 基础 / UI Base
=========== */
function TopNav() {
  const loc = useLocation();
  const { t } = useLanguage();
  
  const linkStyle = (path) => ({
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 14,
    fontWeight: 800,
    color: loc.pathname === path ? "white" : "#111827",
    background: loc.pathname === path ? "#111827" : "transparent",
  });

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link to="/" style={linkStyle("/")}>
        {t.nav.home}
      </Link>
      <Link to="/estimate" style={linkStyle("/estimate")}>
        {t.nav.estimate}
      </Link>
      <Link to="/ask" style={linkStyle("/ask")}>
        {t.nav.ask}
      </Link>
    </div>
  );
}

function Layout({ children }) {
  const { language, changeLanguage } = useLanguage();
  
  useEffect(() => {
    document.documentElement.style.colorScheme = "light";
    document.body.style.backgroundColor = "#ffffff";
  }, []);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI",
        fontSize: 16,
        lineHeight: 1.6,
        color: "#111827",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <div style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 900 }}>{SETTINGS.brandName}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <TopNav />
            <button
              onClick={() => changeLanguage(language === "zh" ? "en" : "zh")}
              style={{
                padding: "6px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {language === "zh" ? "EN" : "中文"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 960,
            padding: "32px 16px",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          {children}
        </div>
      </div>

      <FloatingConnect />
    </div>
  );
}

function FloatingConnect() {
  const { t } = useLanguage();
  
  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 50 }}>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 12,
          background: "white",
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          minWidth: 160,
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 6 }}>{t.contact.title}</div>
        <a
          href={smsHref(SETTINGS.smsNumber)}
          style={{
            display: "block",
            textAlign: "center",
            background: "#111827",
            color: "white",
            padding: 10,
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          {t.contact.sms}
        </a>
        <div style={{ fontSize: 12, color: "#111827" }}>{t.contact.wechat}{SETTINGS.wechatId}</div>
      </div>
    </div>
  );
}

/* ===========
   语言选择页 / Language Selection Page
=========== */
function LanguageSelect() {
  const { changeLanguage, t } = useLanguage();
  const nav = useNavigate();

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    nav("/");
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: "48px 32px",
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontWeight: 900, fontSize: 32, marginBottom: 8 }}>
            {SETTINGS.brandName}
          </div>
          <div style={{ fontSize: 18, color: "#6b7280", fontWeight: 600 }}>
            {t.languageSelect.title}
          </div>
          <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
            {t.languageSelect.subtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button
            onClick={() => selectLanguage("zh")}
            style={{
              width: "100%",
              padding: "20px 24px",
              borderRadius: 16,
              border: "2px solid #e5e7eb",
              background: "white",
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#111827";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "#111827";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#111827";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <span style={{ fontSize: 28 }}>🇨🇳</span>
            <span>{TRANSLATIONS.zh.languageSelect.chinese}</span>
          </button>

          <button
            onClick={() => selectLanguage("en")}
            style={{
              width: "100%",
              padding: "20px 24px",
              borderRadius: 16,
              border: "2px solid #e5e7eb",
              background: "white",
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#111827";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "#111827";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#111827";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <span style={{ fontSize: 28 }}>🇺🇸</span>
            <span>{TRANSLATIONS.en.languageSelect.english}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========
   首页 / Home
=========== */
function Home() {
  const nav = useNavigate();
  const { t, qa } = useLanguage();

  const [input, setInput] = useState("");
  const [openId, setOpenId] = useState(null);

  const [runId, setRunId] = useState(0);
  const [typedDoneMap, setTypedDoneMap] = useState({});

  function toggle(id) {
    setOpenId((cur) => {
      const next = cur === id ? null : id;

      if (next) {
        setRunId((v) => v + 1);
        setTypedDoneMap((m) => ({ ...(m || {}), [next]: false }));
      }

      return next;
    });
  }

  function goAskFromInput() {
    const text = input.trim();
    if (!text) return;
    localStorage.setItem("ask_prefill", text);
    nav("/ask");
  }

  const heroWrap = {
    width: "100%",
    maxWidth: 960,
    margin: "0 auto",
  };

  const contentWrap = {
    width: "100%",
    maxWidth: 640,
    margin: "0 auto",
  };

  const hero = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#0b1220",
    color: "white",
    padding: 20,
  };

  const smallP = {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    marginTop: 10,
    lineHeight: 1.6,
  };

  const whiteCard = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 14,
    background: "white",
  };

  const qRow = {
    width: "100%",
    marginBottom: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "white",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  return (
    <Layout>
      <div style={heroWrap}>
        <div style={hero}>
          <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1.2 }}>
            {t.home.hero.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < t.home.hero.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          <div style={smallP}>
            {t.home.hero.subtitle.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < t.home.hero.subtitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => nav("/estimate")}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "none",
              background: "white",
              color: "#111827",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {t.home.hero.cta}
          </button>

          <div
            style={{
              marginTop: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: 14,
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 14 }}>{t.home.hero.badge}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 6 }}>
              {t.home.hero.badgeSubtitle}
            </div>
          </div>
        </div>
      </div>

      <div style={contentWrap}>
        <div style={{ marginTop: 18, color: "#374151", lineHeight: 1.7, fontSize: 15 }}>
          {t.home.intro.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < t.home.intro.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>{t.home.topQuestions}</div>

          {qa.map((item) => {
            const isOpen = openId === item.id;
            const MAX_OPEN_HEIGHT = 2400;

            return (
              <div key={item.id} style={qRow}>
                <button
                  onClick={() => toggle(item.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 12,
                    border: "none",
                    background: "transparent",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {item.question}
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? MAX_OPEN_HEIGHT : 0,
                    opacity: isOpen ? 1 : 0,
                    transition: "max-height 150ms ease, opacity 150ms ease",
                    overflow: "hidden",
                    background: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      width: 620,
                      maxWidth: "100%",
                      margin: "0 auto",
                      boxSizing: "border-box",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        padding: "0 12px 12px",
                        color: "#374151",
                        lineHeight: 1.7,
                        fontSize: 14,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      {isOpen && (
                        <>
                          <Typewriter
                            key={`${item.id}-${runId}`}
                            text={item.answer}
                            speed={22}
                            onDone={() => {
                              setTypedDoneMap((m) => ({ ...(m || {}), [item.id]: true }));
                            }}
                          />

                          {typedDoneMap?.[item.id] && (
                            <div style={{ marginTop: 14 }}>
                              <button
                                onClick={() => nav("/estimate")}
                                style={{
                                  width: "100%",
                                  padding: "12px 14px",
                                  borderRadius: 14,
                                  border: "1px solid #e5e7eb",
                                  background: "#111827",
                                  color: "white",
                                  fontWeight: 900,
                                  cursor: "pointer",
                                }}
                              >
                                {t.home.ctaButton}
                              </button>

                              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                                {t.home.ctaSubtitle}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 18, ...whiteCard }}>
          <div style={{ fontWeight: 900 }}>{t.home.askSection.title}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            {t.home.askSection.example}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.home.askSection.placeholder}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                minWidth: 0,
              }}
              onKeyDown={(e) => e.key === "Enter" && goAskFromInput()}
            />
            <button
              onClick={goAskFromInput}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "#111827",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t.home.askSection.send}
            </button>
          </div>

          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
            {t.home.askSection.tip}
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ===========
   估算页 / Estimate
=========== */
function Estimate() {
  const nav = useNavigate();
  const { t } = useLanguage();

  const [bill, setBill] = useState("");
  const [zip, setZip] = useState("");

  const hasBill = String(bill).trim() !== "" && Number(bill) > 0;

  const result = useMemo(() => {
    if (!hasBill) return null;

    let low = 0.35;
    let high = 0.7;
    const zl = zipRand(zip, 0.3, 0.4);
    const zh = zipRand(zip, 0.6, 0.75);
    if (zl && zh) {
      low = zl;
      high = zh;
    }
    return {
      saveLow: Math.round(Number(bill) * low),
      saveHigh: Math.round(Number(bill) * high),
    };
  }, [bill, zip, hasBill]);

  return (
    <Layout>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>{t.estimate.title}</div>

        <div style={{ marginTop: 12 }}>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder={t.estimate.billPlaceholder}
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              width: "100%",
            }}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder={t.estimate.zipPlaceholder}
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              width: "100%",
            }}
          />
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            {t.estimate.zipHint}
          </div>
        </div>

        {hasBill && result && (
          <div style={{ marginTop: 16 }}>
            <div>{t.estimate.result.replace("{{low}}", result.saveLow).replace("{{high}}", result.saveHigh)}</div>
          </div>
        )}

        <button
          onClick={() => {
            if (!hasBill) return;
            localStorage.setItem("estimate_ctx", JSON.stringify({ bill: Number(bill) || 0, zip }));
            nav("/deepdive");
          }}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#111827",
            color: "white",
            fontWeight: 900,
            cursor: hasBill ? "pointer" : "not-allowed",
            opacity: hasBill ? 1 : 0.35,
            pointerEvents: hasBill ? "auto" : "none",
          }}
        >
          {t.estimate.continue}
        </button>

        {!hasBill && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
            {t.estimate.requireBill}
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ===========
   DeepDive (继续判断)
=========== */
function DeepDive() {
  const { t } = useLanguage();
  const [ctx, setCtx] = useState(null);

  const [step, setStep] = useState("judge");

  const [isOwner, setIsOwner] = useState("");
  const [usageTime, setUsageTime] = useState("");

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const [computing, setComputing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [computeMsg, setComputeMsg] = useState("");
  const [computePct, setComputePct] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("estimate_ctx");
    if (raw) setCtx(JSON.parse(raw));
  }, []);

  const answeredCount = [isOwner, usageTime].filter(Boolean).length;
  const allAnswered = answeredCount === 2;

  const decisionLevel = useMemo(() => {
    if (!ctx) return "none";

    const b = Number(ctx.bill || 0);

    if (b > 0 && b < 40) return "level3";

    if (isOwner === "no") return "level3";
    if (isOwner !== "yes") return "none";

    if (b < 99) return "level1";
    return "level2";
  }, [ctx, isOwner]);

  useEffect(() => {
    setShowResult(false);
    setComputing(false);
    setComputeMsg("");
    setComputePct(0);

    const canDecide =
      (decisionLevel === "level1" || decisionLevel === "level2" || decisionLevel === "level3") &&
      allAnswered;

    if (!canDecide) return;

    const delay = setTimeout(() => {
      setComputing(true);

      setComputeMsg(t.deepdive.computingSteps.step1);
      setComputePct(18);

      const t1 = setTimeout(() => {
        setComputeMsg(t.deepdive.computingSteps.step2);
        setComputePct(46);
      }, 1400);

      const t2 = setTimeout(() => {
        setComputeMsg(t.deepdive.computingSteps.step3);
        setComputePct(72);
      }, 3000);

      const t3 = setTimeout(() => {
        setComputeMsg(t.deepdive.computingSteps.step4);
        setComputePct(92);
      }, 4200);

      const t4 = setTimeout(() => {
        setComputing(false);
        setShowResult(true);
        setComputeMsg("");
        setComputePct(100);
      }, 5000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }, 200);

    return () => clearTimeout(delay);
  }, [allAnswered, decisionLevel, t]);

  if (!ctx) {
    return (
      <Layout>
        <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
          <div>Please complete the estimate first.</div>
        </div>
      </Layout>
    );
  }

  const card = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 14,
    background: "white",
    marginTop: 12,
  };

  const label = { fontSize: 12, color: "#6b7280", marginTop: 8 };
  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    marginTop: 8,
  };

  const btn = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: active ? "#111827" : "white",
    color: active ? "white" : "#111827",
    fontWeight: 800,
    marginRight: 8,
    marginTop: 8,
  });

  const renderDecision = () => {
    if (!showResult) return null;

    const decisions = {
      level1: t.deepdive.decisions.level1,
      level2: t.deepdive.decisions.level2,
      level3: t.deepdive.decisions.level3,
    };

    const decision = decisions[decisionLevel];
    if (!decision) return null;

    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 900 }}>{decision.title}</div>
        <div style={{ marginTop: 8, color: "#374151", whiteSpace: "pre-line" }}>
          {decision.content}
        </div>

        {decisionLevel !== "level3" && (
          <button onClick={() => setStep("collect")} style={{ marginTop: 12 }}>
            {t.deepdive.decisions.cta}
          </button>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        {step === "judge" && (
          <>
            <div style={{ fontWeight: 900, fontSize: 22 }}>{t.deepdive.title}</div>

            <div style={card}>
              <div style={{ fontWeight: 900 }}>{t.deepdive.receivedInfo}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6, whiteSpace: "pre-line" }}>
                {t.deepdive.receivedDetails.replace("{{bill}}", Number(ctx.bill || 0))}
              </div>

              <div style={label}>{t.deepdive.monthlyBill}</div>
              <input
                type="number"
                value={ctx.bill ?? ""}
                onChange={(e) =>
                  setCtx((c) => ({
                    ...(c || {}),
                    bill: Number(e.target.value) || 0,
                  }))
                }
                placeholder="e.g., 250"
                style={inputStyle}
              />

              <div style={label}>{t.deepdive.zipCode}</div>
              <input
                value={ctx.zip ?? ""}
                onChange={(e) =>
                  setCtx((c) => ({
                    ...(c || {}),
                    zip: e.target.value.replace(/\D/g, "").slice(0, 5),
                  }))
                }
                placeholder="e.g., 90027"
                style={inputStyle}
              />
            </div>

            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
              {t.deepdive.disclaimer}
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 900 }}>{t.deepdive.ownerQuestion}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                {t.deepdive.ownerHint}
              </div>

              <button style={btn(isOwner === "yes")} onClick={() => setIsOwner("yes")}>
                {t.deepdive.yes}
              </button>
              <button style={btn(isOwner === "no")} onClick={() => setIsOwner("no")}>
                {t.deepdive.no}
              </button>
            </div>

            {isOwner === "yes" && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontWeight: 900 }}>{t.deepdive.usageQuestion}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                  {t.deepdive.usageHint}
                </div>

                <button style={btn(usageTime === "day")} onClick={() => setUsageTime("day")}>
                  {t.deepdive.day}
                </button>
                <button style={btn(usageTime === "night")} onClick={() => setUsageTime("night")}>
                  {t.deepdive.night}
                </button>
                <button style={btn(usageTime === "unknown")} onClick={() => setUsageTime("unknown")}>
                  {t.deepdive.unknown}
                </button>
              </div>
            )}

            {isOwner === "yes" && (
              <div style={{ marginTop: 24, ...card }}>
                <div style={{ fontWeight: 900 }}>{t.deepdive.uploadTitle}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6, whiteSpace: "pre-line" }}>
                  {t.deepdive.uploadHint}
                </div>

                <div style={{ marginTop: 10 }}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      setUploadErr("");
                      setFileUrl("");
                      setFileName(f?.name || "");
                      if (!f) return;

                      try {
                        setUploading(true);
                        const out = await uploadToUploadcare(f, INTEGRATIONS.uploadcarePublicKey);
                        setFileUrl(out.fileUrl || "");

                        localStorage.setItem(
                          "deepdive_upload",
                          JSON.stringify({
                            fileName: f.name,
                            fileUrl: out.fileUrl || "",
                            uploadedAt: nowISO(),
                          })
                        );
                      } catch (err) {
                        setUploadErr(err?.message || "Upload failed");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />

                  {fileName && <div style={{ fontSize: 12, marginTop: 6 }}>{t.upload.selected}{fileName}</div>}

                  {uploading && <div style={{ fontSize: 12, marginTop: 6 }}>{t.upload.uploading}</div>}

                  {!!fileUrl && (
                    <div style={{ fontSize: 12, marginTop: 6 }}>
                      {t.upload.success}
                    </div>
                  )}

                  {!!uploadErr && (
                    <div style={{ fontSize: 12, marginTop: 6, color: "#b91c1c" }}>
                      {uploadErr}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
                  {t.deepdive.uploadDisclaimer}
                </div>
              </div>
            )}

            {computing && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 900 }}>{t.deepdive.computing}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                  {computeMsg || "Processing your information..."}
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "#e5e7eb",
                    marginTop: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${computePct}%`,
                      background: "#111827",
                      borderRadius: 999,
                      transition: "width 400ms ease",
                    }}
                  />
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{computePct}%</div>
              </div>
            )}

            {renderDecision()}
          </>
        )}

        {step === "collect" && <CollectStep />}
      </div>
    </Layout>
  );
}

/* ===========
   下一步收集 / Collection Step
=========== */
function CollectStep() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState("analyzing");

  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState("sms");
  const [phone, setPhone] = useState("");
  const [wechat, setWechat] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("ask_contact"), 700);
    return () => clearTimeout(timer);
  }, []);

  const btn = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: active ? "#111827" : "white",
    color: active ? "white" : "#111827",
    fontWeight: 800,
    marginRight: 8,
    marginTop: 8,
  });

  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    marginTop: 10,
  };

  async function handleSubmit() {
    if (submitting) return;
    setSubmitErr("");
    setSubmitted(false);

    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      setSubmitErr(t.collect.errors.name);
      return;
    }

    if (contactMethod === "sms" && !String(phone).trim()) {
      setSubmitErr(t.collect.errors.phone);
      return;
    }

    if (contactMethod === "wechat" && !String(wechat).trim()) {
      setSubmitErr(t.collect.errors.wechat);
      return;
    }

    let estimate = {};
    try {
      estimate = JSON.parse(localStorage.getItem("estimate_ctx") || "{}");
    } catch {}

    let upload = {};
    try {
      upload = JSON.parse(localStorage.getItem("deepdive_upload") || "{}");
    } catch {}

    const payload = {
      time: nowISO(),
      name: trimmedName,
      contactMethod: contactMethod === "sms" ? "phone" : "wechat",
      phone: contactMethod === "sms" ? String(phone).trim() : "",
      wechat: contactMethod === "wechat" ? String(wechat).trim() : "",
      bill: Number(estimate?.bill || 0) || 0,
      zip: String(estimate?.zip || "").trim(),
      fileUrl: String(upload?.fileUrl || "").trim(),
      source: INTEGRATIONS.source,
    };

    try {
      setSubmitting(true);
      await sendToZapier(payload);
      setSubmitted(true);
      alert(t.collect.successAlert);
    } catch (err) {
      setSubmitErr(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div style={{ fontWeight: 900, fontSize: 22 }}>{t.collect.title}</div>

      {phase === "analyzing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>{t.collect.analyzing}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            {t.collect.analyzingHint}
          </div>
        </div>
      )}

      {phase === "ask_contact" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>{t.collect.contactTitle}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            {t.collect.contactHint}
          </div>

          <div
            style={{
              marginTop: 14,
              marginBottom: 18,
              color: "#374151",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.collect.analyzing2}</div>

            <div style={{ fontSize: 13, whiteSpace: "pre-line" }}>
              {t.collect.analyzingDetails}
            </div>

            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>{t.collect.goal}</div>

            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>{t.collect.resultNote}</div>
          </div>

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.collect.namePlaceholder} style={inputStyle} />

          <div style={{ marginTop: 10 }}>
            <button style={btn(contactMethod === "sms")} onClick={() => setContactMethod("sms")}>
              {t.collect.sms}
            </button>
            <button style={btn(contactMethod === "wechat")} onClick={() => setContactMethod("wechat")}>
              {t.collect.wechat}
            </button>
          </div>

          {contactMethod === "sms" && (
            <>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder={t.collect.phonePlaceholder}
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{t.collect.phoneHint}</div>
            </>
          )}

          {contactMethod === "wechat" && (
            <>
              <input
                value={wechat}
                onChange={(e) => setWechat(e.target.value)}
                placeholder={t.collect.wechatPlaceholder}
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{t.collect.wechatHint}</div>
            </>
          )}

          <button
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#111827",
              color: "white",
              fontWeight: 900,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? t.collect.submitting : t.collect.submit}
          </button>

          {!!submitErr && (
            <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 8 }}>
              {submitErr}
            </div>
          )}

          {submitted && (
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              {t.collect.successNote}
            </div>
          )}

          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
            {t.collect.successNote}
          </div>
        </div>
      )}
    </>
  );
}

/* ===========
   提问页 / Ask
=========== */
function Ask() {
  const { t, qa } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const pre = localStorage.getItem("ask_prefill");
    if (pre) {
      localStorage.removeItem("ask_prefill");
      setTimeout(() => {
        const q = pre.trim();
        if (!q) return;

        setMessages((m) => [...m, { role: "user", text: q }]);

        let best = { score: 0, item: null };
        for (const item of qa) {
          const s = overlapScore(q, item.question);
          if (s > best.score) best = { score: s, item };
        }

        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: best.item ? best.item.answer : t.ask.fallback,
          },
        ]);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function send(forced) {
    const q = (forced || input).trim();
    if (!q) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");

    let best = { score: 0, item: null };
    for (const item of qa) {
      const s = overlapScore(q, item.question);
      if (s > best.score) best = { score: s, item };
    }

    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: best.item ? best.item.answer : t.ask.fallback,
      },
    ]);
  }

  return (
    <Layout>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto", display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 900 }}>{t.ask.title}</div>

        <div>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <b>{m.role === "user" ? t.ask.you : t.ask.ai}：</b>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.ask.placeholder}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              minWidth: 0,
            }}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={() => send()} style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
            {t.ask.send}
          </button>
        </div>
      </div>
    </Layout>
  );
}

/* ===========
   路由保护 / Route Protection
=========== */
function ProtectedRoutes() {
  const { language } = useLanguage();
  
  if (!language) {
    return <LanguageSelect />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estimate" element={<Estimate />} />
      <Route path="/deepdive" element={<DeepDive />} />
      <Route path="/ask" element={<Ask />} />
    </Routes>
  );
}

/* ===========
   主应用 / Main App
=========== */
export default function App() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflowY = html.style.overflowY;
    const prevBodyOverflowY = body.style.overflowY;
    const prevGutter = html.style.scrollbarGutter;

    html.style.overflowY = "scroll";
    body.style.overflowY = "scroll";
    html.style.scrollbarGutter = "stable";

    return () => {
      html.style.overflowY = prevHtmlOverflowY;
      body.style.overflowY = prevBodyOverflowY;
      html.style.scrollbarGutter = prevGutter;
    };
  }, []);

  return (
    <LanguageProvider>
      <ProtectedRoutes />
    </LanguageProvider>
  );
}
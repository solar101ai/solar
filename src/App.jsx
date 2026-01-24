import React, { useMemo, useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Typewriter from "./Typewriter";

/* ===========
   设置
=========== */
const SETTINGS = {
  brandName: "Solar101 AI",
  market: "加利福尼亚",
  wechatId: "Uscleanenergy123",
  smsNumber: "+12134589525",
};

/* ===========
   已审批问答
=========== */
const APPROVED_QA = [
  {
    id: "qa_1",
    question: "装太阳能到底能不能省钱？",
    answer: `一、太阳能是怎么变成“省钱工具”的？
最早的太阳能，是科研级和高成本技术，只有少数人用得起。
但随着技术成熟和规模化生产，这十多年里，太阳能发电成本快速下降，
已经从“昂贵替代能源”，变成了全球最便宜的发电方式之一。

换句话说：
👉 今天装太阳能，不再是“为了环保多花钱”
👉 而是开始具备“经济合理性”的能源选择。

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
很多家庭的电费支出可以降低 30%–70%
在用电量高、屋顶条件好、系统设计合理的情况下
有些家庭可以接近“覆盖大部分用电”
一些家庭通过电价套利和储能配合，在高电价时段显著减少电网用电

但同样要说明：
👉 不是每个人都能“接近零电费”
👉 省多少，取决于用电结构、屋顶条件、电价体系、系统设计是否合理

所以，“省钱”本身不是绝对的，
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
    answer: `很多人问“适不适合”，其实是在问：
👉 我的房子会不会是那种一开始就不该装的情况？

一、为什么不是所有房子都适合？
太阳能并不是一个“只要有屋顶就行”的东西。
现实中，确实存在一些结构性限制：

有的屋顶遮挡过多
有的有效可用面积不足
有的用电结构与发电曲线严重不匹配

这些情况不是靠销售话术能解决的。

二、真正影响“适不适合”的是什么？
是否适合，核心不在于某一个条件，而在于组合结果，包括：
屋顶可用性
用电量是否达到有意义的区间
用电时间是否集中在高价时段
系统是否有合理设计空间

只要其中几个关键条件不成立，
即便勉强装上，效果也往往不理想。

三、为什么要先筛掉“不适合”的？
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
    answer: `很多人以为“算省钱”，就是给一个数字。
但真实的判断过程远比一个数字复杂。

一、从什么开始算？
Solar101 AI 的起点不是“你能省多少”，
而是先判断你的用电是否已经进入“有计算意义”的区间。

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

这样你看到的不是一个“看起来很美”的数字，
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

AI 的价值不在于让你“更想装”，
而在于帮你避免走进一个一开始就不理性的路径。`,
  },
  {
    id: "qa_5",
    question: "现在还能不能拿到 ITC？为什么很多人拿不到？",
    answer: `先说结论：
对大多数普通家庭来说，现在直接拿到完整 30% 联邦 ITC 退税，
已经不再是“默认存在”的事情了。

一、政策为什么发生了变化？
过去，《削减通胀法案（IRA）》确实为住宅太阳能提供了 30% 的联邦税收抵免，
这一政策原本计划持续多年。
但在后续相关法案调整中，
住宅端的 30% ITC 实际上被提前终止或大幅收紧。

这意味着：
👉 “装太阳能就一定有 30% 退税”的时代已经结束
👉 是否还能拿到 ITC，变成了一个需要具体判断的问题

二、是不是完全没机会了？
并不是。

在特定区域、满足特定能源和用地结构要求的情况下，
仍然存在通过 Energy Community 等政策资格路径，
实现接近或等同于 30% 退税效果的可能性。

需要说明的是：
Energy Community 不是某一家公司，
而是联邦政策中针对特定地区和能源结构设立的资格类别。

三、为什么很多人现在“拿不到” ITC？
真正的原因往往不是被拒，
而是从一开始选择的项目路径，就不具备退税资格。

很多项目：
所在区域不符合政策定义
用地或能源结构不符合要求
项目设计时没有走可退税的合规路径

在这种情况下，
即便系统顺利装好，也根本不具备申请退税的基础条件。

所以问题不是“政府不给退税”，
而是：
👉 很多项目，从一开始就不是能退税的那一类。

而这，正是 Solar101 AI 要提前帮你判断清楚的部分。`,
  },
];

/* ===========
   工具
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
   UI 基础
=========== */
function TopNav() {
  const loc = useLocation();
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
        首页
      </Link>
      <Link to="/estimate" style={linkStyle("/estimate")}>
        估算
      </Link>
      <Link to="/ask" style={linkStyle("/ask")}>
        提问
      </Link>
    </div>
  );
}

function Layout({ children }) {
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
          <TopNav />
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
        <div style={{ fontWeight: 900, marginBottom: 6 }}>联系真人</div>
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
          短信联系
        </a>
        <div style={{ fontSize: 12, color: "#111827" }}>微信：{SETTINGS.wechatId}</div>
      </div>
    </div>
  );
}

/* ===========
   首页
=========== */
function Home() {
  const nav = useNavigate();

  const [input, setInput] = useState("");
  const [openId, setOpenId] = useState(null);

  // 每次打开一个问题，runId 都会变化，用来强制 Typewriter 重新开始
  const [runId, setRunId] = useState(0);

  // 用于展开动画的 ref
  const refs = useRef({});

  function toggle(id) {
    setOpenId((cur) => {
      const next = cur === id ? null : id;
      if (next) setRunId((v) => v + 1);
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
    marginBottom: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "white",
    overflow: "hidden",
  };

  return (
    <Layout>
      <div style={heroWrap}>
        <div style={hero}>
          <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1.2 }}>
            装太阳能之前
            <br />
            先确认你是不是能真的省钱
          </div>

          <div style={smallP}>
            Solar101 AI 小满客观判断，只回答值不值得装。
            <br />
            你不需要懂太阳能，我先替你把不合适的情况筛掉。
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
            用 AI 判断我能不能省钱（1 分钟）
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
            <div style={{ fontWeight: 900, fontSize: 14 }}>不适合会直说</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 6 }}>
              帮你省时间
            </div>
          </div>
        </div>
      </div>

      <div style={contentWrap}>
        <div style={{ marginTop: 18, color: "#374151", lineHeight: 1.7, fontSize: 15 }}>
          你可以先做 1 分钟判断，
          <br />
          或者先点下面这些关键问题，快速搞清楚是不是值得继续。
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Top 问题</div>

          {APPROVED_QA.map((item) => {
            const isOpen = openId === item.id;

            // 这里不再用 measured 做精确高度，因为 Typewriter 会让高度不断增长
            // 用一个足够大的 maxHeight，配合 opacity 做超轻动画，不会截断内容
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
                    ref={(node) => {
                      if (node) refs.current[item.id] = node;
                    }}
                    style={{
                      padding: "0 12px 12px",
                      color: "#374151",
                      lineHeight: 1.7,
                      fontSize: 14,
                    
                      // ✅ 固定宽度，打字时不会越撑越宽
                      width: "100%",
                      maxWidth: 620,
                      margin: "0 auto",
                    
                      // ✅ 防止长内容把布局撑爆
                      boxSizing: "border-box",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {isOpen && (
                      <Typewriter
                        key={`${item.id}-${runId}`}
                        text={item.answer}
                        speed={28}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 18, ...whiteCard }}>
          <div style={{ fontWeight: 900 }}>也可以直接问我</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            例如：我电费 200 划算吗？为什么别人都说拿不到 ITC？
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在这里输入你的问题"
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
              发送
            </button>
          </div>

          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
            不想打字也行，直接点上面的 Top 问题就能开始。
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ===========
   估算页
=========== */
function Estimate() {
  const nav = useNavigate();

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
        <div style={{ fontWeight: 900, fontSize: 22 }}>估算</div>

        <div style={{ marginTop: 12 }}>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="每月电费大约多少"
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
            placeholder="ZIP（可选）"
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              width: "100%",
            }}
          />
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            帮小满判断，你大概属于哪种用电水平。
          </div>
        </div>

        {hasBill && result && (
          <div style={{ marginTop: 16 }}>
            <div>
              每月可能省 ${result.saveLow} 到 ${result.saveHigh}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            localStorage.setItem("estimate_ctx", JSON.stringify({ bill: Number(bill) || 0, zip }));
            nav("/deepdive");
          }}
          style={{ marginTop: 20 }}
          disabled={!hasBill}
        >
          继续判断
        </button>

        {!hasBill && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
            先输入每月电费后再继续。
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ===========
   DeepDive
=========== */
function DeepDive() {
  const [ctx, setCtx] = useState(null);

  const [step, setStep] = useState("judge");

  const [isOwner, setIsOwner] = useState("");
  const [usageTime, setUsageTime] = useState("");

  const [fileName, setFileName] = useState("");

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

      setComputeMsg("小满正在读取你的用电画像");
      setComputePct(18);

      const t1 = setTimeout(() => {
        setComputeMsg("正在结合加州电价结构和常见系统边界");
        setComputePct(46);
      }, 1400);

      const t2 = setTimeout(() => {
        setComputeMsg("正在检查你是否具备继续评估的基础条件");
        setComputePct(72);
      }, 3000);

      const t3 = setTimeout(() => {
        setComputeMsg("正在生成判断结论");
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
  }, [allAnswered, decisionLevel]);

  if (!ctx) {
    return (
      <Layout>
        <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
          <div>请先完成估算。</div>
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

    if (decisionLevel === "level1") {
      return (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 900 }}>小满判断：当前阶段适合谨慎评估</div>
          <div style={{ marginTop: 8, color: "#374151" }}>
            从目前信息来看，你的用电规模相对较小。
            <br />
            这意味着太阳能是否值得继续，需要更谨慎地判断，不建议直接推进方案。
            <br />
            如果你愿意，我可以基于你更完整的数据帮你把风险和收益拆清楚。
          </div>

          <button onClick={() => setStep("collect")} style={{ marginTop: 12 }}>
            我需要一个更细节的方案
          </button>
        </div>
      );
    }

    if (decisionLevel === "level2") {
      return (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 900 }}>小满判断：值得继续往下做更细节的评估</div>
          <div style={{ marginTop: 8, color: "#374151" }}>
            基于你目前提供的信息，你具备继续评估太阳能的基础条件。
            <br />
            下一步我会站在“是否真的对你划算”的角度，把关键变量拆清楚，避免你被不适合你的方案浪费时间。
          </div>
          <button onClick={() => setStep("collect")} style={{ marginTop: 12 }}>
            我需要一个更细节的方案
          </button>
        </div>
      );
    }

    if (decisionLevel === "level3") {
      return (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 900 }}>小满判断：当前阶段不适合继续推进</div>
          <div style={{ marginTop: 8, color: "#374151" }}>
            基于你目前提供的信息，继续做太阳能评估，实际可落地的空间非常有限。
            <br />
            这类情况下，继续往下走往往更容易消耗时间精力，而很难换来对应的收益。
            <br />
            当你的用电规模、居住条件或决策环境发生变化时，再回来让我重新判断，会更理性。
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        {step === "judge" && (
          <>
            <div style={{ fontWeight: 900, fontSize: 22 }}>继续判断</div>

            <div style={card}>
              <div style={{ fontWeight: 900 }}>小满已收到的信息</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                小满先确认一下我目前掌握的信息：
                <br />
                • 你的每月电费大约在 ${Number(ctx.bill || 0)} 左右
                <br />
                • 用电水平：已结合当地情况初步判断
                <br />
                <br />
                如果有不准确的地方，你可以随时修改。
              </div>

              <div style={label}>每月电费（可修改）</div>
              <input
                type="number"
                value={ctx.bill ?? ""}
                onChange={(e) =>
                  setCtx((c) => ({
                    ...(c || {}),
                    bill: Number(e.target.value) || 0,
                  }))
                }
                placeholder="例如：250"
                style={inputStyle}
              />

              <div style={label}>ZIP（可修改，可选）</div>
              <input
                value={ctx.zip ?? ""}
                onChange={(e) =>
                  setCtx((c) => ({
                    ...(c || {}),
                    zip: e.target.value.replace(/\D/g, "").slice(0, 5),
                  }))
                }
                placeholder="例如：90027"
                style={inputStyle}
              />
            </div>

            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
              下面这几个问题，不是为了推荐方案，而是为了避免你被不适合你的方案浪费时间。
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 900 }}>这个问题我需要先确认一下。</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                太阳能的决策权，通常只在房屋所有人手里，所以我需要确认你是否具备继续评估的前提条件。
              </div>

              <div style={{ fontWeight: 900, marginTop: 10 }}>你目前是房屋所有人吗？</div>
              <button style={btn(isOwner === "yes")} onClick={() => setIsOwner("yes")}>
                是
              </button>
              <button style={btn(isOwner === "no")} onClick={() => setIsOwner("no")}>
                否 / 不确定
              </button>
            </div>

            {isOwner === "yes" && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontWeight: 900 }}>我想了解一下你的用电时间分布。</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                  因为加州现在的电价结构，白天和晚上的价值差别很大，这会直接影响太阳能是否真的帮你省钱。
                </div>

                <div style={{ fontWeight: 900, marginTop: 10 }}>你的用电主要集中在？</div>
                <button style={btn(usageTime === "day")} onClick={() => setUsageTime("day")}>
                  白天
                </button>
                <button style={btn(usageTime === "night")} onClick={() => setUsageTime("night")}>
                  晚上
                </button>
                <button
                  style={btn(usageTime === "unknown")}
                  onClick={() => setUsageTime("unknown")}
                >
                  不确定
                </button>
              </div>
            )}

            {isOwner === "yes" && (
              <div style={{ marginTop: 24, ...card }}>
                <div style={{ fontWeight: 900 }}>让我的判断更贴近你的真实情况（可选）</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                  目前我的判断，是基于常见用电模型和你刚才提供的信息。
                  <br />
                  如果你愿意上传一张最近的电费单，我可以把判断从「大致合理」变成「更贴近你实际情况」。
                </div>

                <div style={{ marginTop: 10 }}>
                  <input
                    type="file"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  />
                  {fileName && (
                    <div style={{ fontSize: 12, marginTop: 6 }}>已选择：{fileName}</div>
                  )}
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
                  仅用于判断是否适合继续评估，不会自动触发销售联系。
                </div>
              </div>
            )}

            {computing && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 900 }}>小满正在计算</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                  {computeMsg || "我在整理你的信息，马上给你一个判断。"}
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
   下一步收集
=========== */
function CollectStep() {
  const [phase, setPhase] = useState("analyzing");

  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState("sms");
  const [phone, setPhone] = useState("");
  const [wechat, setWechat] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setPhase("ask_contact"), 700);
    return () => clearTimeout(t);
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

  return (
    <>
      <div style={{ fontWeight: 900, fontSize: 22 }}>下一步</div>

      {phase === "analyzing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>小满需要一点时间做系统分析</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            我会把你的情况整理成一个更细节的方案，然后发给你。
          </div>
        </div>
      )}

      {phase === "ask_contact" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>我怎么把结果发给你？</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            你可以选择短信或微信，二选一即可。
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
            <div style={{ fontWeight: 700, marginBottom: 6 }}>小满正在继续判断</div>

            <div style={{ fontSize: 13 }}>
              • 你的用电量
              <br />
              • 所在地区的电价情况
              <br />
              • 地址对应的阳光和屋顶条件
              <br />
              • 当前可用的政策和方案
            </div>

            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>
              目标只有一件事：把钱省到最多。
            </div>

            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
              判断完成后，会发给你。
            </div>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的姓名"
            style={inputStyle}
          />

          <div style={{ marginTop: 10 }}>
            <button style={btn(contactMethod === "sms")} onClick={() => setContactMethod("sms")}>
              短信
            </button>
            <button
              style={btn(contactMethod === "wechat")}
              onClick={() => setContactMethod("wechat")}
            >
              微信
            </button>
          </div>

          {contactMethod === "sms" && (
            <>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="手机号"
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
                我会用短信把你的分析结果发给你。
              </div>
            </>
          )}

          {contactMethod === "wechat" && (
            <>
              <input
                value={wechat}
                onChange={(e) => setWechat(e.target.value)}
                placeholder="你的微信号"
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
                我会通过微信把你的分析结果发给你。
              </div>
            </>
          )}

          <button
            style={{ marginTop: 14 }}
            onClick={() => alert("已收到。\n判断正在进行中，\n结果将在 24 到 48 小时内生成并发送。")}
          >
            发送给小满
          </button>
        </div>
      )}
    </>
  );
}

/* ===========
   提问页
=========== */
function Ask() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const pre = localStorage.getItem("ask_prefill");
    if (pre) {
      localStorage.removeItem("ask_prefill");
      setTimeout(() => send(pre), 0);
    }
  }, []);

  function send(forced) {
    const q = (forced || input).trim();
    if (!q) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");

    let best = { score: 0, item: null };
    for (const item of APPROVED_QA) {
      const s = overlapScore(q, item.question);
      if (s > best.score) best = { score: s, item };
    }

    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: best.item ? best.item.answer : "这个问题需要真人确认，建议直接联系我们。",
      },
    ]);
  }

  return (
    <Layout>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto", display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 900 }}>提问</div>

        <div>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <b>{m.role === "user" ? "你" : "AI"}：</b>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
            发送
          </button>
        </div>
      </div>
    </Layout>
  );
}

/* ===========
   路由
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estimate" element={<Estimate />} />
      <Route path="/deepdive" element={<DeepDive />} />
      <Route path="/ask" element={<Ask />} />
    </Routes>
  );
}

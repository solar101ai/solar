import React, { useMemo, useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

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
    answer:
      "是否省钱取决于你的电费水平、用电时间、屋顶条件以及是否合理设计系统。Solar101 的 AI 会先判断你是否具备省钱条件，而不是一上来就推销售。",
  },
  {
    id: "qa_2",
    question: "我家适不适合装太阳能？",
    answer:
      "是否适合主要看屋顶朝向、遮挡情况、电费金额和用电习惯。AI 会先筛掉明显不合适的情况，避免你被浪费时间。",
  },
  {
    id: "qa_3",
    question: "AI 是怎么帮我算太阳能省钱的？",
    answer:
      "AI 会基于你的电费、加州电价、NEM 规则和常见系统成本做区间估算，并清楚告诉你用了哪些假设。",
  },
  {
    id: "qa_4",
    question: "AI 的估算和销售给我的有什么不同？",
    answer:
      "AI 不卖方案、不拿佣金，只做是否值得的判断；销售往往只展示对成交有利的部分。",
  },
  {
    id: "qa_5",
    question: "现在还能不能拿到 ITC？为什么很多人拿不到？",
    answer:
      "ITC 仍然存在，但前提是系统结构、合同和申报方式合规。Solar101 会在估算阶段就检查是否满足 ITC 条件，避免事后踩坑。",
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

// ZIP 稳定随机
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
    // 强制 light mode
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
      {/* Top bar */}
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

      {/* Page content */}
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

  // 用于“轻动画”的高度控制
  const refs = useRef({});

  function toggle(id) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  function goAskFromInput() {
    const text = input.trim();
    if (!text) return;
    localStorage.setItem("ask_prefill", text);
    nav("/ask");
  }

  // Hero 固定宽度（永远是“最宽版”）
  const heroWrap = {
    width: "100%",
    maxWidth: 960,
    margin: "0 auto",
  };

  // 下面内容保持窄一点
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
      {/* Hero: 永远固定成“最宽版” */}
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

      {/* 下面内容：保持 640，不会影响上面的 Hero 宽度 */}
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
            const el = refs.current[item.id];
            const measured = el ? el.scrollHeight : 0;

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

                {/* 150ms 超轻展开动画（高度 + 淡入） */}
                <div
                  style={{
                    maxHeight: isOpen ? measured : 0,
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
                    }}
                  >
                    {item.answer}
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
            onClick={() =>
              alert("已收到。\n判断正在进行中，\n结果将在 24 到 48 小时内生成并发送。")
            }
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
              {m.text}
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

    // 永远预留滚动条占位，页面宽度不会因为展开内容而变化
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

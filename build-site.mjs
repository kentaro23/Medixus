import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = process.cwd();

const navItems = [
  ["私たちについて", "/about/"],
  ["事業内容", "/business/"],
  ["Medixus OS", "/os/"],
  ["ニュース", "/news/"],
  ["採用情報", "/recruit/"],
];

const contactOptions = [
  "Medixus OSの導入検討・資料請求",
  "Medixus OSのデモ予約",
  "医師・看護師としての登録",
  "管理者医師（院長）について",
  "企業・法人との提携",
  "パートナー・提携のご相談",
  "投資に関するご相談",
  "メディア・取材",
  "採用について",
  "その他",
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "株式会社Medixus",
  alternateName: "Medixus, Inc.",
  url: "https://medixus.jp",
  foundingDate: "2025",
  founder: {
    "@type": "Person",
    name: "大原健太郎",
  },
};

const html = String.raw;
const siteUrl = "https://medixus.jp";
const assetVersion = "20260507-news-update";

function image(src, alt, className = "") {
  return `<img src="${src}" alt="${alt}" class="${className}" loading="lazy" decoding="async">`;
}

function selectOptions() {
  return contactOptions.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

function schemaScript(schema) {
  const items = Array.isArray(schema) ? schema : [schema];
  return items.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
}

function header(activePath) {
  const links = navItems
    .map(([label, href]) => {
      const active = activePath === href ? " is-active" : "";
      return `<a href="${href}" class="nav-link${active}">${label}</a>`;
    })
    .join("");

  return html`
    <header class="site-header" data-header>
      <nav class="nav-shell" aria-label="グローバルナビゲーション">
        <a class="brand" href="/" aria-label="Medixus トップページ">
          <img class="brand-logo" src="/assets/images/medixus-logo.png" alt="Medixus">
        </a>
        <button class="menu-toggle" type="button" aria-label="メニューを開く" aria-expanded="false" data-menu-toggle>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="nav-menu" data-nav-menu>
          <div class="nav-links">${links}</div>
          <div class="nav-actions">
            <a class="button button-outline nav-contact" href="/contact/?type=partner">パートナー・提携のご相談</a>
            <a class="button button-accent nav-contact" href="/contact/">お問い合わせ</a>
          </div>
        </div>
      </nav>
    </header>
  `;
}

function footer() {
  return html`
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="footer-logo" href="/" aria-label="Medixus トップページ">
            <img class="footer-logo-image" src="/assets/images/medixus-logo-footer.png?v=${assetVersion}" alt="Medixus">
          </a>
          <p>AIとテクノロジーの力で、すべての人に最高の医療を届ける社会を実現します。</p>
        </div>
        <div>
          <h2>私たちについて</h2>
          <a href="/about/">会社概要</a>
          <a href="/about/#mission">Mission</a>
          <a href="/about/#vision">Vision</a>
          <a href="/message/">代表メッセージ</a>
        </div>
        <div>
          <h2>事業内容</h2>
          <a href="/clinic/">Medixus Clinic</a>
          <a href="/os/">Medixus OS</a>
          <a href="/bpo/">BPOサービス</a>
          <a href="/ir/">IR</a>
        </div>
        <div>
          <h2>ニュース</h2>
          <a href="/news/">プレスリリース</a>
          <a href="/news/">お知らせ</a>
        </div>
        <div>
          <h2>採用情報</h2>
          <a href="/recruit/">採用メッセージ</a>
          <a href="/recruit/#positions">募集職種一覧</a>
          <div class="footer-actions">
            <a class="footer-button" href="/contact/?type=partner">パートナー・提携のご相談</a>
            <a class="footer-button" href="/contact/">お問い合わせ</a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© Medixus Inc. All Rights Reserved.</span>
        <nav aria-label="フッター法務リンク">
          <a href="/privacy/">プライバシーポリシー</a>
          <a href="/privacy/">特定商取引法に基づく表記</a>
        </nav>
      </div>
    </footer>
  `;
}

function layout(page, body) {
  const title = page.title;
  const description = page.description;
  const activePath = page.path === "index.html" ? "/" : `/${page.slug}/`;
  const ogImage = page.ogImage || "/assets/images/medixus-product-hero.jpg";
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;
  const schemas = page.schema ? schemaScript(page.schema) : schemaScript(orgSchema);

  return html`<!doctype html>
    <html lang="ja">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <meta name="description" content="${description}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${absoluteOgImage}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${absoluteOgImage}">
        <link rel="icon" href="/assets/images/medixus-logo.png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Zen+Old+Mincho:wght@600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
        ${schemas}
      </head>
      <body>
        ${header(activePath)}
        <main>${body}</main>
        ${footer()}
        <script src="/assets/site.js?v=${assetVersion}" defer></script>
      </body>
    </html>`;
}

function hero({ eyebrow, title, lead, imageSrc, primary, secondary, className = "" }) {
  const ctas = [primary, secondary]
    .filter(Boolean)
    .map(([label, href, variant = "primary"]) => `<a class="button button-${variant}" href="${href}">${label}</a>`)
    .join("");

  return html`
    <section class="hero ${className}" style="--hero-image: url('${imageSrc}')">
      <div class="container hero-content reveal">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="hero-lead">${lead}</p>
        ${ctas ? `<div class="hero-actions">${ctas}</div>` : ""}
      </div>
    </section>
  `;
}

function sectionHeader(kicker, title, lead = "") {
  return html`
    <div class="section-header reveal">
      <p class="kicker">${kicker}</p>
      <h2>${title}</h2>
      ${lead ? `<p>${lead}</p>` : ""}
    </div>
  `;
}

function subpageHead(title, label, lead) {
  return html`
    <section class="subpage-head">
      <div class="container reveal">
        <h1>${title}</h1>
        <p class="subpage-label">${label}</p>
        <p>${lead}</p>
      </div>
    </section>
  `;
}

function homeHero() {
  return html`
    <section class="home-hero-v2" id="top">
      <div class="container home-hero-grid">
        <div class="home-hero-copy reveal">
          <h1><span class="hero-line">すべての人に</span><span class="hero-line accent">最高の医療を</span></h1>
          <p class="hero-lead-v2">AIとテクノロジーの力で、時間とアクセス格差をなくし、いつでも、どこでも、誰もが最高の医療を受けられる社会を実現します。</p>
          <div class="hero-actions">
            <a class="button button-primary" href="/business/">詳しく見る</a>
            <a class="button button-outline" href="/contact/">お問い合わせ</a>
          </div>
          <div class="hero-stat-row">
            ${heroStat("2030年までに", "300", "店舗", "clinic")}
            ${heroStat("最短", "15", "分完結", "clock")}
          </div>
        </div>
        <div class="hero-visual hero-visual-composite reveal" aria-label="Medixus Clinicと医療プラットフォームのイメージ">
          ${image("/assets/images/medixus-home-hero-final.png", "Medixus Clinicと医療プラットフォームの背景イメージ", "hero-clinic-image")}
        </div>
      </div>
      <a class="scroll-cue" href="#problem">SCROLL<span></span></a>
    </section>
  `;
}

function homePage() {
  return html`
    ${homeHero()}

    <section class="section problem-section" id="problem">
      <div class="container">
        ${sectionHeader("", "医療は、まだ<wbr>非効率すぎる")}
        <div class="pain-grid">
          ${painCard("users", "患者体験", "1時間待ち、3分診療", "待ち時間が多く、薬をもらいたいだけの人も長い時間病院にいる必要がある")}
          ${painCard("building", "開業コスト", "重い初期負担", "新規クリニック立ち上げには複数の契約・採用・設備調整が必要になる")}
          ${painCard("puzzle", "DX化の遅延", "現場ごとの分断", "予約、問診、会計、経営管理が分かれ、データが活用されにくい")}
        </div>
        <div class="statement-bar reveal">課題は、医療現場の問題だけでなく、<span>経営構造にもある</span></div>
      </div>
    </section>

    <section class="section os-overview" id="business">
      <div class="container">
        <div class="os-head">
          <div class="reveal">
            <h2>Medixus OSで、医療の未来をアップデート</h2>
            <div class="os-icon-row">
              ${osIcon("chat", "AI問診")}
              ${osIcon("calendar", "予約管理")}
              ${osIcon("doctor", "オンライン診療")}
              ${osIcon("phone", "スマホ決済")}
              ${osIcon("chart", "待ち時間<br>モニタリング")}
              ${osIcon("sync", "混雑時<br>医師マッチング")}
            </div>
          </div>
          <div class="device-shot reveal">
            ${image("/assets/images/medixus-product-hero.jpg", "Medixus OSのプロダクト画面", "device-image")}
          </div>
        </div>
        <div class="benefit-grid">
          ${benefitCard("user", "患者: 待たない", "気になった時にすぐに相談し、快適に受診できる")}
          ${benefitCard("stethoscope", "医師: 柔軟に働ける", "OS内で問診からカルテまで一体化し、診療に集中できる")}
          ${benefitCard("operations", "病院: 省人化・効率化", "医療者が必要な時間帯のみ稼働し、現場負荷を軽減できる")}
        </div>
        <div class="info-strip reveal">
          <span class="line-icon monitor"></span>
          <p>Medixus OSで混雑を感知すると、オンライン診療可能な医師をマッチングし、院内でオンライン診療を開始します。</p>
        </div>
      </div>
    </section>

    <section class="section clinic-plan" id="about">
      <div class="container clinic-grid">
        <div class="reveal">
          <h2>Medixus Clinic<br>全国300店舗へ</h2>
          <p>Medixus Clinicは、テクノロジーで医療体験を再定義する次世代型クリニックです。受付、問診、会計、診療補助をデジタル化し、必要な医療にスムーズにつながる受診体験を全国へ広げます。</p>
          <a class="button button-outline" href="/clinic/">詳しく見る</a>
        </div>
        <div class="clinic-feature-grid reveal">
          ${clinicFeature("駅前立地で<br>アクセス抜群")}
          ${clinicFeature("最短15分完結<br>待ち時間削減")}
          ${clinicFeature("AI×オンライン診療で<br>高品質な医療を提供")}
          ${clinicFeature("キャッシュレス<br>自動会計")}
          ${clinicFeature("省人オペレーションで<br>低負荷運営")}
          ${clinicFeature("データ活用で<br>医療の質を向上")}
        </div>
      </div>
    </section>

    <section class="section news-section" id="news">
      <div class="container">
        <div class="news-heading reveal">
          <h2>ニュース</h2>
          <a class="button button-outline" href="/news/">一覧を見る</a>
        </div>
        <div class="news-table reveal">
          ${newsRow("2026.04.22", "プレスリリース", "株式会社Medixusを設立しました")}
          ${newsRow("2026.04.22", "お知らせ", "Medixus OSのβ版を今夏リリース予定")}
          ${newsRow("2026.04.15", "お知らせ", "パートナー提携に関するお問い合わせ窓口を開設")}
        </div>
      </div>
    </section>

    <section class="section section-cta">
      <div class="container cta-slab">
        <div class="reveal">
          <h2>医療の未来を、ともに創りましょう。</h2>
          <p>Medixusは、医療機関・パートナー企業の皆さまと新しい医療体験を社会に届けていきます。</p>
        </div>
        <div class="cta-card reveal">
          <h3>パートナー・提携のご相談</h3>
          <p>サービス導入のご相談、提携に関するお問い合わせなど、お気軽にご連絡ください。</p>
          <a class="button button-primary" href="/contact/?type=partner">お問い合わせはこちら</a>
        </div>
      </div>
    </section>
  `;
}

function heroStat(kicker, value, unit, icon) {
  return html`
    <div class="hero-stat reveal">
      <span class="line-icon ${icon}"></span>
      <p>${kicker}<strong>${value}<small>${unit}</small></strong></p>
    </div>
  `;
}

function painCard(icon, title, value, copy) {
  return html`
    <article class="pain-card reveal">
      <span class="line-icon ${icon}"></span>
      <h3>${title}</h3>
      <strong>${value}</strong>
      <p>${copy}</p>
    </article>
  `;
}

function osIcon(icon, label) {
  return html`
    <div class="os-icon reveal"><span class="line-icon ${icon}"></span><strong>${label}</strong></div>
  `;
}

function benefitCard(icon, title, copy) {
  return html`
    <article class="benefit-card reveal">
      <span class="line-icon ${icon}"></span>
      <h3>${title}</h3>
      <p>${copy}</p>
    </article>
  `;
}

function clinicFeature(text) {
  return html`
    <div class="clinic-feature"><span class="line-icon sparkle"></span><strong>${text}</strong></div>
  `;
}

function newsRow(date, tag, title) {
  return html`
    <a class="news-row" href="/news/">
      <time>${date}</time>
      <span>${tag}</span>
      <strong>${title}</strong>
      <em>›</em>
    </a>
  `;
}

function teamCard(name, role, copy, initials) {
  return html`
    <article class="team-card reveal">
      <div class="avatar">${initials}</div>
      <div>
        <p>${role}</p>
        <h3>${name}</h3>
        <span>${copy}</span>
      </div>
    </article>
  `;
}

function audienceCard(title, label, href) {
  return html`
    <a class="audience-card reveal" href="${href}">
      <span>${title}</span>
      <strong>${label}</strong>
    </a>
  `;
}

function businessPage() {
  return html`
    ${subpageHead("事業内容", "Business", "Medixusが提供するサービスと事業についてご紹介します。")}

    <section class="section page-main-section">
      <div class="container">
        <h2 class="page-section-title reveal">医療の未来を支える3つの事業</h2>
        <div class="service-card-grid">
          ${serviceCard("monitor", "Medixus OS", "AIとテクノロジーを活用した医療プラットフォーム。予約、問診、カルテ、会計、決済、データ分析などを一元管理。", "/os/")}
          ${serviceCard("operations", "BPOサービス", "医療機関のバックオフィス業務を最適化・代行。人材不足の解消とコスト削減を実現します。", "/bpo/")}
          ${serviceCard("building", "Medixus Clinic", "テクノロジーを前提に設計した次世代型クリニック。受付、問診、会計、診療補助をデジタル化し、よりよい受診体験を全国へ広げます。", "/clinic/")}
        </div>

        <div class="business-map-panel reveal">
          <div>
            <h2>2030年までに全国300店舗へ</h2>
            <p>医療をインフラのように、いつでも・どこでも・誰もが最高の医療を受けられる社会をつくります。</p>
          </div>
          <div class="japan-map" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function serviceCard(icon, title, copy, href) {
  return html`
    <a class="service-card reveal" href="${href}">
      <span class="line-icon ${icon}"></span>
      <h3>${title}</h3>
      <p>${copy}</p>
      <strong>詳しく見る 〉</strong>
    </a>
  `;
}

function clinicPage() {
  return html`
    ${subpageHead("Medixus Clinic", "Clinic", "テクノロジーで医療体験を再定義する次世代型クリニック。")}

    <section class="section page-main-section">
      <div class="container split">
        <div class="reveal">
          <p class="kicker">Medixus Clinic</p>
          <h2>いつでも、どこでも、誰もが最高の医療につながる拠点へ。</h2>
          <p class="large-copy">Medixus Clinicは、受付、問診、会計、診療補助をデジタル化し、医療従事者が本来の医療行為に集中できる環境を整えるクリニックモデルです。</p>
          <ul class="check-list large-list">
            <li>予約から問診、会計までをスムーズに接続</li>
            <li>Medixus OSと連携した運営データの可視化</li>
            <li>駅前・生活圏に展開しやすいコンパクトな設計</li>
          </ul>
        </div>
        <figure class="feature-visual reveal">
          ${image("/assets/images/hero-clinic-startup.jpg", "Medixus Clinicのクリニックイメージ")}
        </figure>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        ${sectionHeader("Features", "Medixus Clinicの特徴")}
        <div class="business-grid compact">
          ${simpleCard("患者体験の向上", "待ち時間や手続きの負担を減らし、受診までの流れをわかりやすく整えます。")}
          ${simpleCard("運営の標準化", "現場のオペレーションをデータで把握し、継続的な改善につなげます。")}
          ${simpleCard("医療アクセスの拡張", "都市部から生活圏まで、必要な医療につながる接点を増やします。")}
        </div>
      </div>
    </section>

    <section class="section section-cta">
      <div class="container center">
        <h2>Medixus Clinicに関するご相談はこちら。</h2>
        <a class="button button-primary" href="/contact/?type=partner">パートナー・提携のご相談</a>
      </div>
    </section>
  `;
}

function bpoPage() {
  return html`
    ${subpageHead("BPOサービス", "BPO", "医療機関の運営を支えるバックオフィス支援。")}

    <section class="section page-main-section">
      <div class="container split">
        <div class="reveal">
          <p class="kicker">Business Process Operations</p>
          <h2>医療現場が、医療に集中できる運営基盤を。</h2>
          <p class="large-copy">MedixusのBPOサービスは、医療機関のバックオフィス業務、採用、集患、問い合わせ対応、データ集計を支援し、現場の負荷を減らす運営パートナーです。</p>
          <ul class="check-list large-list">
            <li>問い合わせ・予約・事務業務の運用支援</li>
            <li>採用、HP、SEO、広告運用などの経営管理支援</li>
            <li>Medixus OSと連携した運営データの可視化</li>
          </ul>
        </div>
        <div class="bpo-visual reveal" aria-hidden="true">
          <span class="line-icon operations"></span>
          <strong>Operations</strong>
          <p>Back office / Recruiting / Marketing / Data</p>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        ${sectionHeader("Scope", "支援領域")}
        <div class="business-grid compact">
          ${simpleCard("バックオフィス", "経理、問い合わせ、日々の事務処理など、クリニック運営に必要な業務を支援します。")}
          ${simpleCard("採用・人材運用", "医師、看護師、スタッフ採用と稼働調整を、事業フェーズに合わせて設計します。")}
          ${simpleCard("集患・広報", "HP、SEO、広告、口コミ対応など、地域で選ばれるための接点を整えます。")}
        </div>
      </div>
    </section>

    <section class="section section-cta">
      <div class="container center">
        <h2>BPOサービスに関するご相談はこちら。</h2>
        <a class="button button-primary" href="/contact/?type=partner">パートナー・提携のご相談</a>
      </div>
    </section>
  `;
}

const osFaq = [
  ["既存カルテから移行できますか？", "CSV/ORCA対応予定です。"],
  ["保険診療対応は？", "現在は自由診療特化。今後ロードマップに含みます。"],
  ["サポート体制は？", "チャットとメールで対応します。初月は専任担当が導入を支援します。"],
  ["最低契約期間は？", "6ヶ月です。"],
];

function osPage() {
  return html`
    ${subpageHead("Medixus OS", "OS", "AIとテクノロジーで、医療の業務と体験をアップデートする統合プラットフォーム。")}

    <section class="section page-main-section os-detail-section">
      <div class="container os-detail-grid">
        <div class="os-orbit reveal" aria-label="Medixus OSの機能構成">
          <div class="orbit-center">
            <img class="orbit-logo-mark" src="/assets/images/medixus-mark-exact.png" alt="" aria-hidden="true">
            <strong>Medixus OS</strong>
          </div>
          <div class="orbit-node node-1"><span class="line-icon chat"></span><b>AI問診</b></div>
          <div class="orbit-node node-2"><span class="line-icon calendar"></span><b>予約管理</b></div>
          <div class="orbit-node node-3"><span class="line-icon doctor"></span><b>オンライン診療</b></div>
          <div class="orbit-node node-4"><span class="line-icon phone"></span><b>電子カルテ連携</b></div>
          <div class="orbit-node node-5"><span class="line-icon chart"></span><b>データ分析</b></div>
          <div class="orbit-node node-6"><span class="line-icon sync"></span><b>スマホ決済</b></div>
        </div>
        <div class="os-feature-list reveal">
          ${osFeature("業務の自動化・効率化", "煩雑な業務を自動化し、医療従事者の負担を軽減")}
          ${osFeature("データに基づく経営判断", "リアルタイムデータで、経営の可視化と最適化を支援")}
          ${osFeature("患者体験の向上", "待ち時間を抑え、スムーズで納得感のある受診体験へ")}
          ${osFeature("拡張性の高いシステム", "クリニック規模やニーズに合わせて柔軟にカスタマイズ")}
        </div>
      </div>
      <div class="container">
        <div class="os-cta-panel reveal">
          <div>
            <h2>Medixus OSの導入をご検討の方へ</h2>
            <p>デモのご相談や資料請求はこちらからお問い合わせください。</p>
          </div>
          <a class="button button-light" href="/contact/?type=os">お問い合わせ</a>
        </div>
      </div>
    </section>
  `;
}

function osFeature(title, copy) {
  return html`
    <article class="os-feature">
      <span class="line-icon sparkle"></span>
      <div>
        <h3>${title}</h3>
        <p>${copy}</p>
      </div>
    </article>
  `;
}

function problemCard(num, title, copy) {
  return html`<article class="problem-card reveal"><span>${num}</span><h3>${title}</h3><p>${copy}</p></article>`;
}

function moduleCard(num, title, copy) {
  return html`
    <article class="module-card reveal">
      <div class="module-icon">${String(num).padStart(2, "0")}</div>
      <h3>${title}</h3>
      <p>${copy}</p>
    </article>
  `;
}

function faqList(items) {
  return html`
    <div class="faq-list">
      ${items.map(([q, a]) => `<details class="faq-item reveal"><summary>${q}</summary><p>${a}</p></details>`).join("")}
    </div>
  `;
}

const recruitFaq = [
  ["専門科は？", "問いません。"],
  ["非常勤でも？", "OKです。"],
  ["勤務先と競合？", "業務委託のため原則抵触しません。"],
  ["研修は？", "オンライン1時間を予定しています。"],
];

const recruitPositions = [
  {
    title: "CTO候補",
    type: "経営 / Product & Engineering",
    copy: "Medixus OSとクリニック運営基盤の技術戦略、プロダクト設計、開発組織づくりを担うポジションです。",
    tags: ["技術戦略", "プロダクト設計", "開発組織"],
  },
  {
    title: "COO候補",
    type: "経営 / Operations",
    copy: "クリニック展開、BPO、採用、パートナー連携を横断し、事業運営を前に進めるポジションです。",
    tags: ["事業推進", "オペレーション", "提携"],
  },
  {
    title: "フルスタックエンジニア",
    type: "Engineering",
    copy: "医療現場で使われるWebアプリケーション、業務システム、AI連携機能を実装するポジションです。",
    tags: ["Frontend", "Backend", "AI連携"],
  },
  {
    title: "マーケティング責任者",
    type: "Growth / Marketing",
    copy: "Medixus Clinic、Medixus OS、BPOの認知獲得、リード創出、ブランド設計を担うポジションです。",
    tags: ["ブランド", "リード獲得", "広報"],
  },
];

function recruitPage() {
  return html`
    ${subpageHead("採用情報", "Recruit", "医療の未来を、私たちと一緒に創りませんか？")}

    <section class="section page-main-section recruit-page-section">
      <div class="container">
        <figure class="recruit-hero-image reveal">
          ${image("/assets/images/recruit-workspace.jpg", "Medixusで働く環境のイメージ")}
        </figure>
        <div class="recruit-panel reveal">
          <h2>Medixusで働く魅力</h2>
          <div class="recruit-card-grid">
            ${recruitBenefit("globe", "社会貢献性の高い仕事", "テクノロジーで医療の課題を社会に実装できます。")}
            ${recruitBenefit("building", "裁量とスピード感", "年齢や役職に関係なく、挑戦できる環境です。")}
            ${recruitBenefit("users", "フラットな組織", "役職や経験にとらわれず、オープンに議論できます。")}
            ${recruitBenefit("monitor", "成長できる環境", "急成長フェーズの中で、圧倒的に成長できます。")}
          </div>
          <div class="recruit-cta-row">
            <a class="button button-primary" href="#positions">採用エントリー・募集職種一覧はこちら</a>
            <a class="button button-outline" href="#positions">採用情報を見る</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-soft recruit-positions-section" id="positions">
      <div class="container">
        ${sectionHeader("Open Positions", "募集職種一覧", "現在、事業とプロダクトを一緒につくる創業初期メンバーを募集しています。")}
        <div class="position-grid">
          ${recruitPositions.map((position) => positionCard(position)).join("")}
        </div>
      </div>
    </section>
  `;
}

function recruitBenefit(icon, title, copy) {
  return html`
    <article class="recruit-card">
      <span class="line-icon ${icon}"></span>
      <h3>${title}</h3>
      <p>${copy}</p>
    </article>
  `;
}

function positionCard(position) {
  const href = `/contact/?type=recruit&job=${encodeURIComponent(position.title)}`;
  return html`
    <article class="position-card reveal">
      <p>${position.type}</p>
      <h3>${position.title}</h3>
      <span>${position.copy}</span>
      <div class="position-tags">
        ${position.tags.map((tag) => `<em>${tag}</em>`).join("")}
      </div>
      <a class="button button-outline" href="${href}">この職種に応募する</a>
    </article>
  `;
}

function irPage() {
  return html`
    ${hero({
      eyebrow: "Investor Relations",
      title: "AI医療オペレーションの成長基盤をつくる。",
      lead: "Medixus ClinicとMedixus OSを通じて、クリニック運営の新しい標準を社会実装していきます。",
      imageSrc: "/assets/images/ir-growth.jpg",
      primary: ["投資に関するお問い合わせ", "/contact/?type=ir", "primary"],
    })}

    <section class="section">
      <div class="container">
        ${sectionHeader("Overview", "事業概要")}
        <div class="business-grid compact">
          ${simpleCard("Medixus Clinic", "AIを前提に設計したクリニックチェーン。")}
          ${simpleCard("Medixus OS", "クリニック向け統合AI医療プラットフォーム。")}
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        ${sectionHeader("Growth Thesis", "成長仮説", "医療提供体制、クリニックIT、人材マッチングを横断して、現場の運営基盤を再設計します。")}
        <div class="business-grid compact">
          ${simpleCard("外来医療の運営DX", "受付、問診、カルテ、会計、集患を一体で改善する余地が大きい領域です。")}
          ${simpleCard("クリニック向けOS", "複数システムに分散した日常業務を、AI前提のワークスペースへ統合します。")}
          ${simpleCard("医療人材ネットワーク", "需要変動に合わせて医師・看護師と現場をつなぐ仕組みを構築します。")}
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        ${sectionHeader("Team", "チーム")}
        <div class="team-grid team-grid-single">
          ${teamCard("大原健太郎", "CEO", "北里大学医学部在学中。AIネイティブ起業家。", "OH")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div class="reveal">
          <p class="kicker">Investor Contact</p>
          <h2>投資家の方へ</h2>
          <ul class="check-list large-list">
            <li>事業計画に関する資料は個別に共有します。</li>
            <li>面談をご希望の方はフォームよりお問い合わせください。</li>
            <li>ピッチ資料は確認後、メールにてご案内します。</li>
          </ul>
        </div>
        <form class="form-card reveal" data-static-form>
          <h3>ピッチ資料をダウンロード</h3>
          <label>氏名<input type="text" required></label>
          <label>会社名<input type="text" required></label>
          <label>メール<input type="email" required></label>
          <button class="button button-primary" type="submit">PDFリンクをメール送信</button>
          <p class="form-status" aria-live="polite"></p>
        </form>
      </div>
    </section>

    <section class="section section-cta">
      <div class="container center">
        <h2>投資に関するご相談はこちら。</h2>
        <a class="button button-primary" href="/contact/?type=ir">投資に関するお問い合わせ</a>
      </div>
    </section>
  `;
}

function simpleCard(title, copy) {
  return html`<article class="simple-card reveal"><h3>${title}</h3><p>${copy}</p></article>`;
}

function aboutPage() {
  const rows = [
    ["法人名", "株式会社Medixus（Medixus, Inc.）"],
    ["設立", "2026年4月22日"],
    ["代表取締役", "大原健太郎"],
    ["所在地", "神奈川県相模原市"],
    ["資本金", "30万円"],
    ["株主構成", "代表取締役 CEO 大原 健太郎"],
    ["主要投資家", "Skyland Ventures 5号投資事業有限責任組合"],
    ["事業内容", "医療プラットフォームの開発 / Medixus Clinicの企画・運営 / 医療機関向けBPOサービス"],
  ];

  return html`
    ${subpageHead("会社概要", "About", "株式会社Medixusの基本情報をご紹介します。")}

    <section class="section page-main-section">
      <div class="container about-grid">
        <div class="company-table reveal">
          ${rows.map(([label, value]) => `<div><strong>${label}</strong><p>${value}</p></div>`).join("")}
        </div>
        <aside class="about-brand-panel reveal" aria-label="Medixus brand panel">
          <div class="brand-photo">
            <img class="brand-photo-image" src="/assets/images/medixus-office.jpg" alt="Medixusの事務所受付イメージ">
          </div>
        </aside>
      </div>
      <div class="container">
        <div class="mission-panel reveal">
          <div class="mission-item" id="mission">
            <p>Mission</p>
            <h2>すべての人に最高の医療を</h2>
          </div>
          <div class="mission-item" id="vision">
            <p>Vision</p>
            <h2>医療の待ち時間とアクセス格差をAIでなくす</h2>
          </div>
        </div>
        <section class="founder-message-card reveal" id="message">
          <div class="founder-photo-slot" aria-label="代表写真スペース">
            <span>Photo</span>
          </div>
          <div>
            <p class="kicker">Founder Message</p>
            <h2>代表メッセージ</h2>
            <p>医療の待ち時間とアクセス格差をAIでなくす。Medixusは、誰もが必要なときに必要な医療へつながれる社会を目指しています。</p>
            <a class="button button-outline" href="/message/">詳しく読む</a>
          </div>
        </section>
      </div>
    </section>
  `;
}

function messagePage() {
  return html`
    ${subpageHead("代表メッセージ", "Message", "Medixus代表 大原健太郎からのメッセージ。")}

    <section class="section page-main-section">
      <div class="container message-layout">
        <div class="message-lead reveal">
          <div class="founder-photo-slot founder-photo-slot-large" aria-label="代表写真スペース">
            <span>Photo</span>
          </div>
          <p class="kicker">Founder Message</p>
          <h2>医療の待ち時間とアクセス格差を、AIでなくす。</h2>
          <span>Medixusは、誰もが必要なときに、必要な医療へ迷わずつながれる社会を目指しています。</span>
        </div>
        <article class="message-body reveal">
          <p>医療は、人の生活にとって最も重要なインフラのひとつです。一方で、待ち時間、予約の取りづらさ、地域や時間帯によるアクセス格差、現場の事務負担など、まだ多くの非効率が残っています。</p>
          <p>Medixusは、AIとテクノロジーを医療現場の運営に深く組み込み、患者体験と医療従事者の働き方の両方をアップデートしていきます。医療者が医療に集中でき、患者が必要な医療にすぐつながれる。そのための基盤をつくることが、私たちの使命です。</p>
          <p>まだ始まったばかりの会社ですが、医療機関、研究機関、投資家、パートナーの皆さまとともに、次の医療インフラを社会実装していきます。</p>
          <footer>
            <strong>大原健太郎</strong>
            <span>株式会社Medixus 代表取締役</span>
          </footer>
        </article>
      </div>
    </section>
  `;
}

const newsItems = [
  ["2026.04.22", "プレスリリース", "株式会社Medixusを設立しました"],
  ["2026.04.22", "お知らせ", "Medixus OSのβ版を今夏リリース予定"],
  ["2026.04.15", "お知らせ", "パートナー提携に関するお問い合わせ窓口を開設"],
];

function newsPage() {
  return html`
    ${subpageHead("ニュース", "News", "Medixusの最新情報をお届けします。")}

    <section class="section page-main-section">
      <div class="container narrow">
        <div class="news-table news-table-large reveal">
          ${newsItems.map(([date, tag, title]) => newsRow(date, tag, title)).join("")}
        </div>
        <div class="news-page-button reveal">
          <a class="button button-outline" href="/news/">ニュース一覧へ 〉</a>
        </div>
      </div>
    </section>
  `;
}

function contactPage() {
  return html`
    <section class="page-head">
      <div class="container reveal">
        <p class="eyebrow">Contact</p>
        <h1>お問い合わせ</h1>
        <p>Medixus OS、IR、採用、法人連携などについてお気軽にお問い合わせください。</p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <form class="contact-form reveal" data-contact-form data-static-form>
          <div class="form-two">
            <label>お名前（必須）<input type="text" name="name" required></label>
            <label>会社名・所属（任意）<input type="text" name="company"></label>
          </div>
          <div class="form-two">
            <label>メールアドレス（必須）<input type="email" name="email" required></label>
            <label>電話番号（任意）<input type="tel" name="phone"></label>
          </div>
          <label>お問い合わせ種別（必須）
            <select name="type" required data-contact-type>
              <option value="">選択してください</option>
              ${selectOptions()}
            </select>
          </label>
          <label>お問い合わせ内容（必須）<textarea name="message" rows="8" required data-contact-message></textarea></label>
          <button class="button button-primary" type="submit">送信する</button>
          <p class="form-status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  `;
}

function privacyPage() {
  const items = [
    ["個人情報の取得・利用目的", "当社は、お問い合わせ対応、サービス提供、採用選考、投資家・取引先との連絡、サービス改善のために必要な範囲で個人情報を取得・利用します。"],
    ["第三者提供", "法令に基づく場合、本人の同意がある場合、業務委託先に必要な範囲で提供する場合を除き、個人情報を第三者へ提供しません。"],
    ["Cookie / GA4の使用", "当サイトではアクセス解析や品質改善のため、CookieおよびGoogle Analytics 4を使用する場合があります。ブラウザ設定によりCookieを無効化できます。"],
    ["開示・訂正・削除", "本人から個人情報の開示、訂正、利用停止、削除の請求があった場合、法令に従い速やかに対応します。"],
    ["問い合わせ窓口", "個人情報に関するお問い合わせは、お問い合わせフォームよりご連絡ください。"],
  ];

  return html`
    <section class="page-head">
      <div class="container reveal">
        <p class="eyebrow">Privacy</p>
        <h1>プライバシーポリシー</h1>
        <p>株式会社Medixusは、個人情報を適切に取り扱います。</p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow policy-list">
        ${items.map(([title, copy]) => `<article class="policy-item reveal"><h2>${title}</h2><p>${copy}</p></article>`).join("")}
      </div>
    </section>
  `;
}

const pages = [
  {
    slug: "",
    path: "index.html",
    title: "Medixus - すべての人に最高の医療を。",
    description: "すべての人に最高の医療を。AIクリニック運営支援・統合AI医療プラットフォームを通じて、医療体験を再設計するMedixus。",
    body: homePage,
    ogImage: "/assets/images/medixus-home-hero-final.png",
    schema: orgSchema,
  },
  {
    slug: "business",
    path: "business/index.html",
    title: "事業紹介 - Medixus",
    description: "Medixus Clinic・Medixus OS・BPOサービスでクリニック運営を革新。",
    body: businessPage,
    ogImage: "/assets/images/business-flow.jpg",
    schema: orgSchema,
  },
  {
    slug: "clinic",
    path: "clinic/index.html",
    title: "Medixus Clinic - Medixus",
    description: "テクノロジーで医療体験を再定義する次世代型クリニック。",
    body: clinicPage,
    ogImage: "/assets/images/hero-clinic-startup.jpg",
    schema: orgSchema,
  },
  {
    slug: "bpo",
    path: "bpo/index.html",
    title: "BPOサービス - Medixus",
    description: "医療機関のバックオフィス、採用、集患、データ活用を支援するBPOサービス。",
    body: bpoPage,
    ogImage: "/assets/images/business-flow.jpg",
    schema: orgSchema,
  },
  {
    slug: "os",
    path: "os/index.html",
    title: "Medixus OS - クリニック向け統合AI医療プラットフォーム",
    description: "電子カルテ・予約・問診・決済・HP・SEO・経営分析を統合するAI医療プラットフォーム。",
    body: osPage,
    ogImage: "/assets/images/os-dashboard.jpg",
    schema: [orgSchema, faqSchema(osFaq)],
  },
  {
    slug: "news",
    path: "news/index.html",
    title: "ニュース - Medixus",
    description: "Medixusのプレスリリースとお知らせ。",
    body: newsPage,
    ogImage: "/assets/images/hero-clinic-startup.jpg",
    schema: orgSchema,
  },
  {
    slug: "recruit",
    path: "recruit/index.html",
    title: "医師・看護師募集 - Medixus",
    description: "オンライン診察・現地看護など、Medixusの医療人材ネットワークへの登録。",
    body: recruitPage,
    ogImage: "/assets/images/recruit-workspace.jpg",
    schema: [orgSchema, faqSchema(recruitFaq)],
  },
  {
    slug: "ir",
    path: "ir/index.html",
    title: "投資家情報 - Medixus",
    description: "AI医療オペレーションの社会実装を目指すMedixusの投資家向け情報。",
    body: irPage,
    ogImage: "/assets/images/ir-growth.jpg",
    schema: orgSchema,
  },
  {
    slug: "about",
    path: "about/index.html",
    title: "会社概要 - 株式会社Medixus",
    description: "AI医療プラットフォームを開発する株式会社Medixus。",
    body: aboutPage,
    schema: orgSchema,
  },
  {
    slug: "message",
    path: "message/index.html",
    title: "代表メッセージ - Medixus",
    description: "Medixus代表 大原健太郎からのメッセージ。",
    body: messagePage,
    schema: orgSchema,
  },
  {
    slug: "contact",
    path: "contact/index.html",
    title: "お問い合わせ - Medixus",
    description: "Medixusへのお問い合わせ。OS導入、デモ、投資、採用、法人連携について。",
    body: contactPage,
    schema: orgSchema,
  },
  {
    slug: "privacy",
    path: "privacy/index.html",
    title: "プライバシーポリシー - Medixus",
    description: "株式会社Medixusのプライバシーポリシー。",
    body: privacyPage,
    schema: orgSchema,
  },
];

for (const page of pages) {
  const filePath = join(outDir, page.path);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, layout(page, page.body()), "utf8");
}

console.log(`Generated ${pages.length} pages.`);

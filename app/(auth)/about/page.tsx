export const dynamic = "force-static";

export default function About() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">About</h1>
      <p className="mb-8 text-lg text-primary">
        誰でも自由に話題を投稿し、交流できるコミュニティサービスです。
      </p>

      <div className="space-y-6 text-muted leading-relaxed">
        <p>
          日常の出来事や趣味の話、質問、相談、雑談など、ジャンルを問わず気軽にスレッドを作成して会話を始めることができます。
        </p>

        <div>
          <p className="mb-2 font-medium text-foreground">
            こんな時に気軽に立ち寄ってください。
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>ちょっと誰かに聞いてみたい</li>
            <li>他の人の考えを知りたい</li>
            <li>気軽に会話したい</li>
          </ul>
        </div>

        <p>
          投稿されたスレッドにはコメントを通して交流することができ、さまざまな人とのつながりや新しい発見が生まれる場になることを願っています。
        </p>

        <p>
          シンプルで使いやすい構成を大切にしながら、誰でも気軽に利用できる掲示板として運営しています。
        </p>
      </div>
    </div>
  );
}

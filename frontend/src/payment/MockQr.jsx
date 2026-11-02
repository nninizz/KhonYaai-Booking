// QR จำลอง — สร้างลวดลายจาก payload (สแกนไม่ได้จริง ใช้แสดงผลเท่านั้น)
const N = 25;

function hash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)) >>> 0) / 4294967296;
}

function finder(x, y) {
  return [
    <rect key={`o${x}${y}`} x={x} y={y} width="7" height="7" fill="#000" />,
    <rect key={`m${x}${y}`} x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />,
    <rect key={`i${x}${y}`} x={x + 2} y={y + 2} width="3" height="3" fill="#000" />,
  ];
}

export default function MockQr({ payload }) {
  const rand = hash(payload);
  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const inFinder = (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
      if (!inFinder && rand() > 0.5) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />);
    }
  }
  return (
    <svg className="qr" viewBox={`-2 -2 ${N + 4} ${N + 4}`} role="img" aria-label="QR พร้อมเพย์จำลอง">
      <rect x="-2" y="-2" width={N + 4} height={N + 4} fill="#fff" />
      {cells}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
}

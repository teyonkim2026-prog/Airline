const $ = (id) => document.getElementById(id);

function normalize(angle) {
  return ((angle % 360) + 360) % 360;
}

function angleDiff(a, b) {
  let d = normalize(a - b);
  if (d > 180) d -= 360;
  return d;
}

function calculate() {
  const departure = $("departure").value || "Departure";
  const destination = $("destination").value || "Destination";
  const heading = Number($("heading").value) || 0;
  const airspeed = Math.max(Number($("airspeed").value) || 1, 1);
  const windDirection = Number($("windDirection").value) || 0;
  const windSpeed = Math.max(Number($("windSpeed").value) || 0, 0);

  // 항공기 벡터: heading 기준
  const h = heading * Math.PI / 180;

  // 풍향은 "불어오는 방향"이므로 실제 바람 이동 방향은 +180°
  const windTo = normalize(windDirection + 180);
  const w = windTo * Math.PI / 180;

  // 북쪽을 y+, 동쪽을 x+로 두는 2차원 벡터
  const vx = airspeed * Math.sin(h) + windSpeed * Math.sin(w);
  const vy = airspeed * Math.cos(h) + windSpeed * Math.cos(w);

  const groundSpeed = Math.sqrt(vx * vx + vy * vy);
  const groundHeading = normalize(Math.atan2(vx, vy) * 180 / Math.PI);

  // 항공기의 원래 heading과 지상 진행방향의 차이
  const correction = angleDiff(groundHeading, heading);

  // 교육용 계산: 1000 km를 기준으로 시간 표시
  const referenceDistance = 1000;
  const hours = referenceDistance / groundSpeed;
  const minutes = Math.round(hours * 60);

  $("baseHeading").textContent = `${Math.round(normalize(heading))}°`;
  $("correctionAngle").textContent = `${Math.abs(correction).toFixed(1)}° ${correction >= 0 ? "우" : "좌"}`;
  $("groundSpeed").textContent = `${groundSpeed.toFixed(1)} km/h`;
  $("flightTime").textContent = `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
  $("routeText").textContent = `${departure} → ${destination}`;
  $("startLabel").textContent = departure;
  $("endLabel").textContent = destination;

  const arrow = $("windArrow");
  arrow.style.transform = `rotate(${windTo}deg)`;

  $("message").textContent =
    `바람을 고려한 지상 진행 방향은 약 ${groundHeading.toFixed(1)}°이며, ` +
    `1000 km 비행을 가정하면 약 ${Math.floor(minutes / 60)}시간 ${minutes % 60}분이 걸립니다.`;
}

function animatePlane() {
  const plane = $("plane");
  plane.style.left = "11%";
  plane.style.top = "58%";

  requestAnimationFrame(() => {
    setTimeout(() => {
      plane.style.left = "75%";
      plane.style.top = "30%";
    }, 250);
  });
}

$("calculate").addEventListener("click", calculate);
$("animate").addEventListener("click", animatePlane);

calculate();

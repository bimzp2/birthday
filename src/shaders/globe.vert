uniform float uTime;
uniform float uSize;
uniform vec2 uMouse;
attribute float aScale;
attribute float aPhase;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;
  float distToMouse = length(pos.xy - uMouse * 2.0);
  float mouseInfluence = smoothstep(1.5, 0.0, distToMouse) * 0.3;
  pos += normal * sin(uTime * 0.5 + aPhase) * 0.05;
  pos += normal * mouseInfluence;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * aScale * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  
  vAlpha = 0.3 + 0.7 * aScale;
  float warmth = pos.y * 0.5 + 0.5;
  vColor = mix(vec3(0.95, 0.82, 0.72), vec3(0.91, 0.77, 0.77), warmth);
}

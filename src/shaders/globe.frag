varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
  gl_FragColor = vec4(vColor, alpha * 0.8);
}

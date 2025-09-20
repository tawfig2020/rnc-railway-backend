// Pattern generator for background elements
// Creates subtle, culturally-inspired patterns for use across the RNC site

export const generateDotPattern = (color = '#2A7D6F', opacity = 0.03, spacing = 20) => {
  return `url("data:image/svg+xml,%3Csvg width='${spacing * 2}' height='${spacing * 2}' viewBox='0 0 ${spacing * 2} ${spacing * 2}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'%3E%3Ccircle cx='${spacing}' cy='${spacing}' r='2'/%3E%3C/g%3E%3C/svg%3E")`;
};

export const generateWavePattern = (color = '#2A7D6F', opacity = 0.03, spacing = 100) => {
  return `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing / 2}' viewBox='0 0 ${spacing} ${spacing / 2}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 ${spacing / 4} c ${spacing / 4} -${spacing / 8}, ${spacing / 4} ${spacing / 8}, ${spacing / 2} 0 s ${spacing / 4} -${spacing / 8}, ${spacing / 2} 0' stroke='${encodeURIComponent(color)}' stroke-width='1' fill='none' stroke-opacity='${opacity}' /%3E%3C/svg%3E")`;
};

export const generateDiamondPattern = (color = '#2A7D6F', opacity = 0.03, spacing = 60) => {
  return `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='${spacing / 2}' height='${spacing / 2}' transform='translate(${spacing / 4},${spacing / 4}) rotate(45)' stroke='${encodeURIComponent(color)}' stroke-width='1' fill='none' stroke-opacity='${opacity}' /%3E%3C/svg%3E")`;
};

export const generateTrianglePattern = (color = '#2A7D6F', opacity = 0.03, spacing = 60) => {
  return `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M${spacing / 2} ${spacing / 6} L${spacing - spacing / 6} ${spacing - spacing / 6} L${spacing / 6} ${spacing - spacing / 6} Z' stroke='${encodeURIComponent(color)}' stroke-width='1' fill='none' stroke-opacity='${opacity}' /%3E%3C/svg%3E")`;
};

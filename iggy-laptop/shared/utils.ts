function Delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function CalcDist(
    start_x: number,
    start_y: number,
    start_z: number,
    target_x: number,
    target_y: number,
    target_z: number
) {
    var a = start_x - target_x;
    var b = start_y - target_y;
    var c = start_z - target_z;

    return Math.sqrt(a * a + b * b + c * c);
}

export { Delay, CalcDist };

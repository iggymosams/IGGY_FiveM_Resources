function Delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
global.exports("Delay", Delay);

function CalcDist(
    start_x: number,
    start_y: number,
    start_z: number,
    target_x: number,
    target_y: number,
    target_z: number
): number {
    var a = start_x - target_x;
    var b = start_y - target_y;
    var c = start_z - target_z;

    return Math.sqrt(a * a + b * b + c * c);
}
global.exports("CalcDist", CalcDist);

function RandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
global.exports("RandomNumber", RandomNumber);

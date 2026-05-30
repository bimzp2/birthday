const fs = require('fs');

function testHeart() {
    let count = 0;
    let tries = 0;
    while(count < 100) {
        tries++;
        let x = (Math.random() - 0.5) * 3;
        let y = (Math.random() - 0.5) * 3;
        let z = (Math.random() - 0.5) * 3;
        const xx = x*x;
        const yy = y*y;
        const zz = z*z;
        const a = xx + 2.25 * zz + yy - 1;
        const val = a*a*a - xx * y*yy - 0.1125 * zz * y*yy;
        if (val < 0.0 && val > -0.1) {
            count++;
        }
    }
    console.log(`Tries: ${tries} for 100 points`);
}
testHeart();

// function throwError(msg:string):never {
//     throw new Error(msg);
// }
// throwError("문제 발생!");

function infiniteLoop():never{
    while(true){
        console.log("무한 반복 중...");
    }
}
infiniteLoop();
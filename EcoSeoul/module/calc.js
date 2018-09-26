module.exports = {							// 두 개의 메소드 module화
	percentage : async (...args) => {								// (...args) expression은 arrow function 사
        let past = args[0];
        let present = args[1];
        let result = new Object;
        
        if (past > present) {   //절약
            result = {
                up_down : 0,
                percentage : Math.round(present / past * 100)
            }
        } else if (past < present) {
            result = {     //과소비
                up_down : 1,
                percentage : Math.round(past / present * 100)
                
            }
        } else {
            result = {     //같음
                up_down : 2,
                percentage : 0    
            }
        }

        result.past = past;
        result.present = present;

        return result;

    }
}   
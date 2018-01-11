export const centerSprites = (sprites) => {
    sprites.forEach(function (sprite){
        sprite.anchor.setTo(0.5,0.5);
    })

};

export const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};


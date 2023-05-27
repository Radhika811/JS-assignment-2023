const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

const scoreEl = document.getElementById('scoreEl');

canvas.width = 440
canvas.height = 520

class Boundary{
    static width = 40;
    static height = 40;
    constructor({position, image}) {
        this.position = position
        this.width = 40;
        this.height = 40;
        this.image = image
    }

    draw() {
        // c.fillStyle= 'blue';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player{
    static speed = 4;
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.8
        this.openRate = 0.12
        this.rotation = 0
        this.speed = 4;
    }

    draw(){
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians<0 || this.radians > 0.75) this.openRate = -this.openRate
        this.radians += this.openRate 
    }   
}

class Ghost{
    static speed = 2
    constructor({position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw(){
        
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

class Pellets{
    constructor({position}) {
        this.position = position
        this.radius = 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

class PowerUp{
    constructor({position}) {
        this.position = position
        this.radius = 8
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

const keys = {
    w: {
        pressed : false
    },
    a: {
        pressed : false
    },
    s: {
        pressed : false
    },
    d: {
        pressed : false
    },
    ArrowDown: {
        pressed : false
    },
    ArrowLeft: {
        pressed : false
    },
    ArrowRight: {
        pressed : false
    },
    ArrowUp: {
        pressed : false
    }

}

let lastkey = ''
let score = 0
if(localStorage.getItem('highScore')==null){
    localStorage.setItem('highScore', 0)
}else{
    var key = localStorage.getItem('highScore');
    console.log(key)
}



const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.','.', '.', '.', '.','.', '.', '.', '|'],
    ['|', '.', 'b','p', '[', '7', ']','.', 'b', '.', '|'],
    ['|', '.', '.','.', '.', '_', '.','.', '.', '.', '|'],
    ['|', '.', '[',']', '.', '.', '.','[', ']', '.', '|'],
    ['|', '.', '.','.', '.', '^', '.','.', '.', '.', '|'],
    ['|', '.', 'b','.', '[', '+', ']','p', 'b', '.', '|'],
    ['|', '.', '.','.', '.', '_', '.','.', '.', '.', '|'],
    ['|', '.', '[',']', '.', '.', '.','[', ']', '.', '|'],
    ['|', '.', '.','.', '.', '^', '.','.', '.', '.', '|'],
    ['|', '.', 'b','.', '[', '5', ']','.', 'b', '.', '|'],
    ['|', '.', '.','.', '.', '.', '.','.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
]

function spawn(ghostcolor){
    const ghost = new Ghost({
        position: {
            x:Boundary.width * 1 + Boundary.width /2, 
            y:Boundary.height * 11 + Boundary.height/2
        },
        velocity: {
            x:Ghost.speed,
            y:0
        },
        color: ghostcolor
    })
    ghosts.push(ghost);
}

const powerUps = []
const ghosts = [
    new Ghost({
        position: {
            x:Boundary.width * 6 + Boundary.width /2, 
            y:Boundary.height * 3 / 2
        },
        velocity: {
            x:Ghost.speed,
            y:0
        }
    }),

    new Ghost({
        position: {
            x:Boundary.width * 6 + Boundary.width /2, 
            y:Boundary.height * 3 + Boundary.width /2
        },
        velocity: {
            x:Ghost.speed,
            y:0
        },
        color: 'purple'
    }),

    new Ghost({
        position: {
            x:Boundary.width * 6 + Boundary.width /2, 
            y:Boundary.height * 11 + Boundary.width/2
        },
        velocity: {
            x:Ghost.speed,
            y:0
        },
        color: 'pink'
    }), 

    new Ghost({
        position: {
            x:Boundary.width * 7 + Boundary.width /2, 
            y:Boundary.height * 5 + Boundary.width/2
        },
        velocity: {
            x:Ghost.speed,
            y:0
        },
        color: 'green'
    })
] 
const pellets = []
const boundaries = []
const p = new Player({
    position : {
        x : Boundary.width + Boundary.width / 2,
        y : Boundary.height + Boundary.height / 2
    },
    velocity: {
        x : 0,
        y : 0
    },
})

function createImage(src) {
    const image = new Image()
    image.src = src
    return image; 
}

function newHighScore(score){
    if(score > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', score)
    }
    return localStorage.getItem('highScore')
}


map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol){
            case '-': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeHorizontal.png')
                    })
                )
                break;
            
            case '|': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeVertical.png')
                    })
                )
                break;
            case '1': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeCorner1.png')
                    })
                )
                break;
            case '2': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeCorner2.png')
                    })
                )
                break;
            case '3': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeCorner3.png')
                    })
                )
                break;
            case '4': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeCorner4.png')
                    })
                )
                break;
            case 'b': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/block.png')
                    })
                )
                break;
            case '[': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/capLeft.png')
                    })
                )
                break;
            case ']': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/capRight.png')
                    })
                )
                break;
            case '5': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeConnectorTop.png')
                    })
                )
                break;
            case '7': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeConnectorBottom.png')
                    })
                )
                break;
            case '_': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/capBottom.png')
                    })
                )
                break;
            case '^': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/capTop.png')
                    })
                )
                break;
            case '+': 
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./Pipes/pipeCross.png')
                    })
                )
                break;
            case '.': 
                pellets.push(
                    new Pellets({
                        position:{
                            x: Boundary.width * j + Boundary.width/2,
                            y: Boundary.height * i + Boundary.height/2
                        },
                    })
                )
                break;
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position:{
                            x: Boundary.width * j + Boundary.width/2,
                            y: Boundary.height * i + Boundary.height/2
                        },
                    })
                )
                break;
        }
    })
})

function collision({circle, rectangle}){
    const padding = rectangle.width/2 - circle.radius - 1;
    return(circle.position.y - circle.radius + circle.velocity.y<= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y>= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}


let annimationID;

function animate() {
    annimationID = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if((keys.w.pressed && lastkey==='w') || (keys.ArrowUp.pressed && lastkey==='ArrowUp')){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(collision({
                circle: {...p, velocity: {
                    x:0,
                    y:-p.speed
                }},
                rectangle: boundary
            })){
                p.velocity.y = 0;
                break;
            }
            else p.velocity.y = -p.speed
        }
    }
    else if((keys.a.pressed && lastkey==='a') || (keys.ArrowLeft.pressed && lastkey==='ArrowLeft')){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(collision({
                circle: {...p, velocity: {
                    x:-p.speed,
                    y:0
                }},
                rectangle: boundary
            })){
                p.velocity.x = 0;
                break;
            }
            else p.velocity.x = -p.speed
        }
    }
    else if((keys.s.pressed && lastkey==='s') || (keys.ArrowDown.pressed && lastkey==='ArrowDown')){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(collision({
                circle: {...p, velocity: {
                    x:0,
                    y:p.speed
                }},
                rectangle: boundary
            })){
                p.velocity.y = 0;
                break;
            }
            else p.velocity.y = p.speed
        }
    }
    else if((keys.d.pressed && lastkey==='d') || (keys.ArrowRight.pressed && lastkey==='ArrowRight')){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(collision({
                circle: {...p, velocity: {
                    x:p.speed,
                    y:0
                }},
                rectangle: boundary
            })){
                p.velocity.x = 0;
                break;
            }
            else p.velocity.x = p.speed
        }
    }

    //pellets
    for(let i = pellets.length-1; i>=0; i--){
        const pellet = pellets[i];
        pellet.draw();
 
        if( Math.hypot(pellet.position.x - p.position.x, pellet.position.y-p.position.y) < p.radius + pellet.radius){
            pellets.splice(i, 1) 
            score +=10
            scoreEl.innerHTML = score
        } 
    }

    //detect collision between player & ghost
    for(let i = ghosts.length-1; i>=0; i--){
        if( Math.hypot(ghosts[i].position.x - p.position.x, ghosts[i].position.y-p.position.y) < p.radius + ghosts[i].radius){

            if(!ghosts[i].scared){
                cancelAnimationFrame(annimationID)
                console.log("you lose")
                document.getElementById('score').innerHTML = score;
                document.getElementById('lose').style.display = "flex";
                document.getElementById('highScoreLose').innerHTML = newHighScore(score);
            }
            else{
                spawn(ghosts[i].color);
                ghosts.splice(i, 1)
                score += 100;
            }
        }
    } 

    //win-condition
    if(pellets.length === 0){
        cancelAnimationFrame(annimationID)
        console.log("you win");
        document.getElementById('scoreVal').innerHTML = score;
        document.getElementById('win').style.display = "flex";
        
        document.getElementById('highScoreWin').innerHTML = newHighScore(score);
    }


    //powerups
    for(let i = powerUps.length-1; i>=0; i--){
        const powerUp = powerUps[i];
        powerUp.draw()
 
        if( Math.hypot(powerUp.position.x - p.position.x, powerUp.position.y-p.position.y) < p.radius + powerUp.radius){
            powerUps.splice(i, 1) 
            score += 50
            scoreEl.innerHTML = score

            //make ghosts scared
            ghosts.forEach((ghost) => {
                ghost.scared = true;
                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })
        } 
    }
 
    boundaries.forEach((boundary)=>{
        boundary.draw();

        if(collision({
            circle: p,
            rectangle: boundary
        })){
            p.velocity.y = 0;
            p.velocity.x = 0;
        }
    })

    p.update();

    ghosts.forEach((ghost) => {
        ghost.update();

        const collisions = []
        boundaries.forEach((boundary) => {
            if(!collisions.includes('right') && collision({
                circle: {...ghost, velocity: {
                    x:ghost.speed,
                    y:0
                }},
                rectangle: boundary
            })){
                collisions.push('right')
            }

            if(!collisions.includes('left') && collision({
                circle: {...ghost, velocity: {
                    x:-ghost.speed,
                    y:0
                }},
                rectangle: boundary
            })){
                collisions.push('left')
            }

            if(!collisions.includes('top') && collision({
                circle: {...ghost, velocity: {
                    x:0,
                    y:-ghost.speed
                }},
                rectangle: boundary
            })){
                collisions.push('top')
            }

            if(!collisions.includes('bottom') && collision({
                circle: {...ghost, velocity: {
                    x:0,
                    y:ghost.speed
                }},
                rectangle: boundary
            })){
                collisions.push('bottom')
            }
        })
        if(collisions.length > ghost.prevCollisions.length){
            ghost.prevCollisions = collisions
        }

        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
            if(ghost.velocity.x > 0) {
                ghost.prevCollisions.push('right')
            }
            else if(ghost.velocity.x < 0) {
                ghost.prevCollisions.push('left')
            }
            else if(ghost.velocity.y > 0) {
                ghost.prevCollisions.push('bottom')
            }
            else if(ghost.velocity.y < 0) {
                ghost.prevCollisions.push('top')
            }

            const pathways = ghost.prevCollisions.filter(collision => {
                
                return !collisions.includes(collision)
            })
            //console.log({pathways})

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            switch(direction){
                case 'bottom':
                    ghost.velocity.y = ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'top':
                    ghost.velocity.y = -ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'right':
                    ghost.velocity.x = ghost.speed;
                    ghost.velocity.y = 0;
                    break;
                case 'left':
                    ghost.velocity.x = -ghost.speed;
                    ghost.velocity.y = 0;
                    break;
            }
            ghost.prevCollisions = []
        }
    })

    if(p.velocity.x>0) p.rotation = 0;
    else if(p.velocity.x<0) p.rotation = Math.PI;
    else if(p.velocity.y>0) p.rotation = Math.PI*0.5;
    else if(p.velocity.y<0) p.rotation = Math.PI*1.5;
}

animate();

addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break;
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break;
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break;
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastkey = 'ArrowUp'
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastkey = 'ArrowDown'
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastkey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastkey = 'ArrowLeft'
            break;
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            lastkey = 'ArrowUp'
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            lastkey = 'ArrowDown'
            break;
        case 'ArrowRight':
            keys.ArrowUp.pressed = false
            lastkey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowUp.pressed = false
            lastkey = 'ArrowLeft'
            break;
    }
})


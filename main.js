/* ========== LAYOUT ========== */

const $root = document.getElementById('root')
$root.style.height = `${$root.offsetWidth}px` 

window.addEventListener('resize', () => {
    $root.style.height = `${$root.offsetWidth}px` 
})

/* ========== UTILS ========== */

const icons = ['&#127775', '&#127783', '&#127794', '&#127802', '&#127804', '&#127812']

const difficulty = {
    'easy': 9,
    'intermediate': 8,
    'hard': 7
}

const clone = (data) => JSON.parse(JSON.stringify(data))

const numberRandom = (max, number) => {
    const random = Math.round(Math.random() * max)
    if(random === number) {
        return numberRandom(max, number)
    }
    return random
}

/* ========== GRID ========== */

const generateGrid = (size) => {
    let grid = []

    for (let index = 0; index < size; index++) {
        let array = []
        
        for (let i = 0; i < size; i++) {
            array.push(
                numberRandom(icons.length - 1)
            )
        }

        grid.push(array)
        array = []
    }

    return grid
}

const cleanGrid = (array) => {
    for (let index = 0; index < array.length; index++) {
        for (let i = 0; i < array.length; i++) {
            if(
                array[index][i] === (array[index + 1] ? array[index + 1][i] : null)
                &&
                array[index][i] === (array[index + 2] ? array[index + 2][i] : null)
            ) {
                array[index][i] = numberRandom(icons.length - 1, array[index][i])
            }

            if(
                array[index][i] === array[index][i + 1] 
                && 
                array[index][i] === array[index][i + 2] 
            ) {
                array[index][i] = numberRandom(icons.length - 1, array[index][i])
            }
        }
    }
    for (let index = 0; index < array.length; index++) {
        for (let i = 0; i < array.length; i++) {
            if(
                (array[index][i] === (array[index + 1] ? array[index + 1][i] : null)
                &&
                array[index][i] === (array[index + 2] ? array[index + 2][i] : null))
                            
                ||
                            
                (array[index][i] === array[index][i + 1] 
                && 
                array[index][i] === array[index][i + 2] )
            ) {
                cleanGrid(array)
            }
        }

    }
}

const grid = generateGrid(difficulty.easy)
cleanGrid(grid)

const renderGrid = (difficulty) => {
    $root.innerHTML = `<main class="grid grid--${difficulty}">
    </main>`

    const html = grid.map((item, index) => 
        item.map((el, i)=> 
            `<div 
                data-row="${index}" 
                data-col="${i}" 
                data-icon="${el}"
                class="item item--${difficulty}"
                id="${index}-${i}"
                >
                ${icons[el]}
            </div>`        
        ).join(' ')
    ).join(' ')

    $root.innerHTML =  
       ` <main class="grid grid--${difficulty}">
            ${html}
        </main>
        `
}
renderGrid(9)


/* ========== FUNCTIONS ========== */

const isAdyacent = () => {
    if(
        // En ROW
        select1.getAttribute('data-row') 
        ===
        select2.getAttribute('data-row')
        &&
        parseInt(select2.getAttribute('data-col'))
        ===
        parseInt(select1.getAttribute('data-col')) + 1
    
        ||

        select1.getAttribute('data-row') 
        ===
        select2.getAttribute('data-row')
        &&
        parseInt(select2.getAttribute('data-col'))
        ===
        parseInt(select1.getAttribute('data-col')) - 1
        
        || 

        // En COL
        select1.getAttribute('data-col') 
        ===
        select2.getAttribute('data-col')
        &&
        parseInt(select2.getAttribute('data-row'))
        ===
        parseInt(select1.getAttribute('data-row')) + 1

        ||

        select1.getAttribute('data-col') 
        ===
        select2.getAttribute('data-col')
        &&
        parseInt(select2.getAttribute('data-row'))
        ===
        parseInt(select1.getAttribute('data-row')) - 1
    
    ) {
        return true
    } 

    return false
}

const exchange = () => {
    const row1 = parseInt(select1.getAttribute('data-row'))
    const row2 = parseInt(select2.getAttribute('data-row'))
    const col1 = parseInt(select1.getAttribute('data-col'))
    const col2 = parseInt(select2.getAttribute('data-col'))
    const icon1 = clone(parseInt(select1.getAttribute('data-icon')))
    const icon2 = clone(parseInt(select2.getAttribute('data-icon')))


    if(
        row1 === row2
    ) {
        // Si son en ROW
        grid[row1][col1] = icon2
        grid[row1][col2] = icon1
    
        select1.setAttribute('data-icon', icon2)
        select2.setAttribute('data-icon', icon1)
        select1.innerHTML = icons[icon2]
        select2.innerHTML = icons[icon1]

        return 'row'
    } else if(col1 === col2 ) {
        // Si son en ROW
        grid[row1][col1] = icon2
        grid[row2][col1] = icon1
    
        select1.setAttribute('data-icon', icon2)
        select2.setAttribute('data-icon', icon1)
        select1.innerHTML = icons[icon2]
        select2.innerHTML = icons[icon1]

        return 'col'
    }
            
}

const caerElementosHorizontal = (x, array) => {
    const X = parseInt(x)
    if(X === 0) {
        array.forEach(el => {
            grid[X][el] = numberRandom(icons.length - 1)
        }); 
    }  else {
        for (let i = X; i >= 0; i--) {
            array.forEach(el => {
                grid[i][el] = i !== 0 ? grid[i - 1][el] : numberRandom(icons.length - 1)
            });
        }
    }
}

const caerElementosVertical = (col, array) => {
    const COL = parseInt(col)
    for (let i = Math.max(...array); i >= 0; i--) {
        grid[i][COL] =  grid[i - array.length] ?  grid[i - array.length][COL] : numberRandom(icons.length - 1)
    }
}

const existBlockHorizontal = (orientation) => {
    switch (orientation) {
        case 'row':
            const row = select1.getAttribute('data-row')

            for (let i = 0; i < grid.length; i++) {
                if(
                    grid[row][i] === grid[row][i + 1]
                    && 
                    grid[row][i] === grid[row][i + 2]
                ) {
                    return {
                        row: parseInt(row),
                        index: [i, i + 1, i + 2]
                    }
                }
            }
            break;
        case 'col':
            const row1 = select1.getAttribute('data-row')
            const row2 = select2.getAttribute('data-row')

            for (let  i = 0; i < grid.length; i++) {
                if(
                    grid[row1][i] === grid[row1][i + 1]
                    && 
                    grid[row1][i] === grid[row1][i + 2]
                ) {
                    return {
                        row: parseInt(row1),
                        index: [i, i + 1, i + 2]
                    }
                }
                else if(
                    grid[row2][i] === grid[row2][i + 1]
                    && 
                    grid[row2][i] === grid[row2][i + 2]
                ) {
                    return {
                        row: parseInt(row2),
                        index: [i, i + 1, i + 2]
                    }
                }
            }
            break;
        default:
            break;
    }

}

const existBlockVertical = (orientation) => {
    switch (orientation) {
        case 'row':
            const col1 = select1.getAttribute('data-col')
            const col2 = select2.getAttribute('data-col')

            for (let i = 0; i < grid.length; i++) {
                if(
                    grid[i][col1]
                    === 
                    (grid[i + 1] ? 
                    grid[i + 1][col1] : null)
                    && 
                    grid[i][col1]
                    === 
                    (grid[i + 2] ? 
                    grid[i + 2][col1] : null)
                ) {
                    return {
                        col: parseInt(col1),
                        index: [i, i + 1, i + 2]
                    }
                } else if(
                    grid[i][col2]
                    === 
                    (grid[i + 1] ? 
                    grid[i + 1][col2] : null)
                    && 
                    grid[i][col2]
                    === 
                    (grid[i + 2] ? 
                    grid[i + 2][col2] : null)
                ) {
                    return {
                        col: parseInt(col2),
                        index: [i, i + 1, i + 2]
                    }
                }
            }
            break;
        case 'col':
            const col = select1.getAttribute('data-col')

            for (let i = 0; i < grid.length; i++) {
                if(
                    grid[i][col]
                    === 
                    (grid[i + 1] ? 
                    grid[i + 1][col] : null)
                    && 
                    grid[i][col]
                    === 
                    (grid[i + 2] ? 
                    grid[i + 2][col] : null)
                ) {
                    return {
                        col: parseInt(col),
                        index: [i, i + 1, i + 2]
                    }
                }
            }
            break;
        default:
            break;
    }
}

/* ========== ANIMATION ========== */
const animate = (position) => {
    select1.style.zIndex = `2`
    const left = `${select1.offsetWidth + 4 }px`
    const top = `${select1.offsetHeight + 4 }px`

    switch (position) {
        case 'left':
            select1.style.left = `${left}`
            select2.style.left = `-${left}`
            break;
        case 'right':
            select1.style.left = `-${left}`
            select2.style.left = `${left}`
            break;
        case 'top':
            select1.style.top = `-${top}`
            select2.style.top = `${top}`
            break;
        case 'bottom':
            select1.style.top = `${top}`
            select2.style.top = `-${top}`
            break;
    
        default:
            break;
    }
}

const resetAnimate = () => {
    select1.style.left = `0`
    select2.style.left = `0`  
    select1.style.top = `0`
    select2.style.top = `0`  
}

const validatedAnimation = () => {
    if(
        parseInt(select1.getAttribute('data-col'))
        < 
        parseInt(select2.getAttribute('data-col'))
    ) {
        animate('left')
    } 
    else if(
        parseInt(select1.getAttribute('data-col'))
        > 
        parseInt(select2.getAttribute('data-col'))
    ) {
        animate('right')
    } else if(
        parseInt(select1.getAttribute('data-row'))
        < 
        parseInt(select2.getAttribute('data-row'))  
    ) {
        animate('bottom')
    } else if(
        parseInt(select1.getAttribute('data-row'))
        > 
        parseInt(select2.getAttribute('data-row'))  
    ) {
        animate('top')
    }
}


/* ========== ACTIONS ========== */

let click = 0

let select1 = null
let select2 = null

const clicked = (element) => {
    click++

    if(click === 1) {
        select1 = element
        select1.classList.add('select')
    }
    else if(click === 2) {
        select2 = element

        if(isAdyacent()) {
            validatedAnimation() 

            const orientation = exchange()

            const optionsHorizontal = existBlockHorizontal(orientation)
            const optionsVertical = existBlockVertical(orientation)

            if(optionsHorizontal) {
                resetAnimate()

                caerElementosHorizontal(optionsHorizontal.row, optionsHorizontal.index)

                setTimeout(() => {
                    renderGrid(difficulty.easy)
                }, 1000);
            } else if(optionsVertical) {
                resetAnimate()
                
                caerElementosVertical(optionsVertical.col, optionsVertical.index)

                setTimeout(() => {
                    renderGrid(difficulty.easy)
                }, 1000);
            } else {
                console.log('No hay bloque')
                setTimeout(() => {
                    resetAnimate() 
                }, 600);
                exchange()  
            }

        } else {
            select1.classList.remove('select')

            select1 = element
            select1.classList.add('select')
            select2 = null
            click = 1
        }
    } else {
        select1.classList.remove('select')
        click = 0
        select1 = null
        select2 = null
        clicked(element)
    }
}

$root.addEventListener('click', event => {
    if(event.target.tagName === 'DIV') {
        clicked(event.target)
    }
})

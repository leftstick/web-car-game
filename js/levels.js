const LEVELS = [
    {
        id: 1,
        name: '第1关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 0, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 2, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car2', x: 4, y: 1, length: 3, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car3', x: 3, y: 4, length: 2, direction: 'horizontal', color: 'red', isTarget: false }
        ]
    },
    {
        id: 2,
        name: '第2关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 1, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 0, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car2', x: 1, y: 0, length: 2, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car3', x: 3, y: 0, length: 3, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car4', x: 3, y: 1, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car5', x: 5, y: 1, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car6', x: 2, y: 4, length: 2, direction: 'horizontal', color: 'purple', isTarget: false },
            { id: 'car7', x: 0, y: 5, length: 2, direction: 'horizontal', color: 'red', isTarget: false }
        ]
    },
    {
        id: 3,
        name: '第3关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 0, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 2, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car2', x: 3, y: 0, length: 3, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car3', x: 5, y: 1, length: 2, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car4', x: 2, y: 2, length: 3, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car5', x: 4, y: 2, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car6', x: 1, y: 5, length: 2, direction: 'horizontal', color: 'red', isTarget: false }
        ]
    },
    {
        id: 4,
        name: '第4关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 0, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 2, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car2', x: 3, y: 0, length: 3, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car3', x: 5, y: 1, length: 2, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car4', x: 2, y: 2, length: 3, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car5', x: 4, y: 2, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car6', x: 1, y: 5, length: 2, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car7', x: 0, y: 4, length: 2, direction: 'vertical', color: 'purple', isTarget: false }
        ]
    },
    {
        id: 5,
        name: '第5关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 0, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 0, y: 0, length: 2, direction: 'horizontal', color: 'green', isTarget: false },
            { id: 'car2', x: 2, y: 0, length: 2, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car3', x: 3, y: 0, length: 2, direction: 'horizontal', color: 'blue', isTarget: false },
            { id: 'car4', x: 5, y: 0, length: 3, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car5', x: 2, y: 2, length: 3, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car6', x: 3, y: 2, length: 2, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car7', x: 4, y: 3, length: 2, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car8', x: 0, y: 4, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car9', x: 1, y: 5, length: 2, direction: 'horizontal', color: 'purple', isTarget: false },
            { id: 'car10', x: 3, y: 5, length: 2, direction: 'horizontal', color: 'green', isTarget: false }
        ]
    },
    {
        id: 6,
        name: '第6关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 1, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 0, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car2', x: 1, y: 0, length: 3, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car3', x: 4, y: 0, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car4', x: 5, y: 0, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car5', x: 0, y: 3, length: 2, direction: 'horizontal', color: 'orange', isTarget: false },
            { id: 'car6', x: 2, y: 3, length: 3, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car7', x: 3, y: 3, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car8', x: 4, y: 2, length: 2, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car9', x: 5, y: 2, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car10', x: 0, y: 5, length: 2, direction: 'horizontal', color: 'purple', isTarget: false },
            { id: 'car11', x: 4, y: 4, length: 2, direction: 'horizontal', color: 'orange', isTarget: false }
        ]
    },
    {
        id: 7,
        name: '第7关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 0, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 0, y: 0, length: 2, direction: 'horizontal', color: 'blue', isTarget: false },
            { id: 'car2', x: 2, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car3', x: 3, y: 0, length: 2, direction: 'horizontal', color: 'purple', isTarget: false },
            { id: 'car4', x: 5, y: 0, length: 3, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car5', x: 2, y: 2, length: 3, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car6', x: 3, y: 2, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car7', x: 4, y: 3, length: 2, direction: 'horizontal', color: 'green', isTarget: false },
            { id: 'car8', x: 0, y: 3, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car9', x: 1, y: 5, length: 2, direction: 'horizontal', color: 'orange', isTarget: false },
            { id: 'car10', x: 4, y: 5, length: 2, direction: 'horizontal', color: 'red', isTarget: false }
        ]
    },
    {
        id: 8,
        name: '第8关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 1, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 0, y: 0, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car2', x: 1, y: 0, length: 3, direction: 'horizontal', color: 'green', isTarget: false },
            { id: 'car3', x: 4, y: 0, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car4', x: 5, y: 0, length: 2, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car5', x: 0, y: 3, length: 2, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car6', x: 2, y: 3, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car7', x: 3, y: 1, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car8', x: 4, y: 2, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car9', x: 5, y: 2, length: 2, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car10', x: 1, y: 5, length: 3, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car11', x: 4, y: 4, length: 2, direction: 'horizontal', color: 'blue', isTarget: false }
        ]
    },
    {
        id: 9,
        name: '第9关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 0, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 1, y: 0, length: 2, direction: 'horizontal', color: 'blue', isTarget: false },
            { id: 'car2', x: 2, y: 1, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car3', x: 3, y: 0, length: 2, direction: 'horizontal', color: 'purple', isTarget: false },
            { id: 'car4', x: 5, y: 2, length: 3, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car5', x: 2, y: 3, length: 3, direction: 'vertical', color: 'red', isTarget: false },
            { id: 'car6', x: 3, y: 4, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car7', x: 3, y: 3, length: 2, direction: 'horizontal', color: 'green', isTarget: false },
            { id: 'car8', x: 0, y: 3, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car9', x: 0, y: 5, length: 2, direction: 'horizontal', color: 'orange', isTarget: false },
            { id: 'car10', x: 4, y: 5, length: 2, direction: 'horizontal', color: 'red', isTarget: false }
        ]
    },
    {
        id: 10,
        name: '第10关',
        gridSize: 6,
        exitRow: 2,
        cars: [
            { id: 'target', x: 1, y: 2, length: 2, direction: 'horizontal', color: 'yellow', isTarget: true },
            { id: 'car1', x: 0, y: 1, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car2', x: 0, y: 0, length: 3, direction: 'horizontal', color: 'green', isTarget: false },
            { id: 'car3', x: 4, y: 0, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car4', x: 5, y: 2, length: 2, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car5', x: 0, y: 3, length: 2, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car6', x: 2, y: 3, length: 2, direction: 'vertical', color: 'blue', isTarget: false },
            { id: 'car7', x: 3, y: 0, length: 2, direction: 'vertical', color: 'green', isTarget: false },
            { id: 'car8', x: 4, y: 2, length: 2, direction: 'vertical', color: 'purple', isTarget: false },
            { id: 'car9', x: 5, y: 4, length: 2, direction: 'vertical', color: 'orange', isTarget: false },
            { id: 'car10', x: 1, y: 5, length: 3, direction: 'horizontal', color: 'red', isTarget: false },
            { id: 'car11', x: 3, y: 4, length: 2, direction: 'horizontal', color: 'blue', isTarget: false }
        ]
    }
];

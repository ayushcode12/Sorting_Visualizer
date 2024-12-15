let isPaused = false; // Global flag to handle pause
let isSorting = false; // Prevent multiple sorting operations at the same time
let animationSpeed = 700; // Default animation speed

// Dynamically create bars for visualization
const visualizer = document.getElementById('visualizer');
let array = [];

// Utility function to delay animation
function delay(speed = animationSpeed) {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      if (!isPaused) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function toggleBarsPosition() {
  const visualizer = document.getElementById('visualizer');
  visualizer.classList.toggle('upside-down');
}


function changeBarColors() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    const randomColor = getRandomColor();
    bar.style.backgroundColor = randomColor;
  });
}

function handleButtonPress(button, action) {
  // Clear active state from all buttons
  document.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));

  // Set the clicked button as active
  button.classList.add('active');

  // Execute the corresponding action
  if (action === 'randomizeArray') randomizeArray();
  else if (action === 'changeSize') changeSize();
  else if (action === 'pause') pause();
  else if (action === 'resetBarColors') resetBarColors();
  else if (['bubble', 'quick', 'merge', 'insertion', 'selection'].includes(action)) startSort(action);
  else alert('Functionality not yet implemented!');
}

// Generate a randomized array
function randomizeArray() {
  if (isSorting) return alert("Wait for the current sorting to finish!");
  visualizer.innerHTML = ''; // Clear existing bars
  array = []; // Reset array
  const arraySize = 50; // Number of bars
  for (let i = 0; i < arraySize; i++) {
    const value = Math.floor(Math.random() * 200) + 50; // Bar height
    array.push(value);
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${value}px`;
    visualizer.appendChild(bar);
  }
}

async function swapBars(bar1, bar2) {
  // Temporarily disable transitions to force reflow (ensures smooth animation)
  bar1.style.transition = 'none';
  bar2.style.transition = 'none';

  // Trigger reflow by accessing a layout property
  void bar1.offsetHeight;
  void bar2.offsetHeight;

  // Re-enable transitions
  bar1.style.transition = 'height 0.5s ease';
  bar2.style.transition = 'height 0.5s ease';

  // Swap heights with a transition
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;

  // Wait for the transition to complete
  await delay(animationSpeed);
}




// Reset bar colors
function resetBarColors() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar) => {
    bar.style.backgroundColor = 'blue';
  });
}

// Pause and Resume
function pause() {
  isPaused = !isPaused;
  document.querySelector('[onclick="pause()"]').innerText = isPaused ? 'Resume' : 'Pause';
}

function changeSize() {
  const newSize = prompt('Enter the number of bars (5-100):', 20);
  if (newSize && newSize >= 5 && newSize <= 100) {
    visualizer.innerHTML = ''; // Clear current bars
    array = [];
    const arraySize = Number(newSize);
    for (let i = 0; i < arraySize; i++) {
      const value = Math.floor(Math.random() * 200) + 50; // Random bar heights
      array.push(value);
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${value}px`;
      visualizer.appendChild(bar);
    }
  } else {
    alert('Invalid size. Please enter a number between 5 and 100.');
  }
}

async function insertionSort() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    // Highlight the current bar being sorted
    bars[i].style.backgroundColor = 'red';

    // Shift elements and animate the swap
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];

      // Swap the bars visually
      await swapBars(bars[j + 1], bars[j]);

      j--;
    }

    array[j + 1] = key;

    // Reset colors
    bars[i].style.backgroundColor = 'blue';
  }
}

function updateSpeed(value) {
  animationSpeed = Number(value);
  document.getElementById('speed-value').innerText = `${value}ms`;

  // Update bar transition durations dynamically
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    bar.style.transition = `height ${animationSpeed / 1000}s ease`;
  });
}


  
async function selectionSort() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    bars[minIndex].style.backgroundColor = 'red';
  
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = 'yellow';
      await delay();
  
      if (array[j] < array[minIndex]) {
        if (minIndex !== i) bars[minIndex].style.backgroundColor = 'blue';
          minIndex = j;
      } else {
        bars[j].style.backgroundColor = 'blue';
      }
    }
  
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
  
      // Animate the swapping of bars
      await swapBars(bars[i], bars[minIndex]);
    }
  
    bars[minIndex].style.backgroundColor = 'blue';
    bars[i].style.backgroundColor = 'blue';
   }
}
  
// Bubble Sort
async function bubbleSort() {
  const bars = document.querySelectorAll('.bar');
  isSorting = true;

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.backgroundColor = 'red';
      bars[j + 1].style.backgroundColor = 'red';

      if (array[j] > array[j + 1]) {
        // Swap values in the array
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        // Animate the swapping of bars
        await swapBars(bars[j], bars[j + 1]);
      }

      bars[j].style.backgroundColor = 'blue';
      bars[j + 1].style.backgroundColor = 'blue';
    }
  }

  isSorting = false;
}


// Quick Sort
async function partition(low, high, bars) {
  let pivot = array[high];
  let i = low - 1;
  bars[high].style.backgroundColor = 'yellow'; // Pivot

  for (let j = low; j < high; j++) {
    bars[j].style.backgroundColor = 'red';

    if (array[j] < pivot) {
      i++;

      // Swap array elements and animate bars
      [array[i], array[j]] = [array[j], array[i]];
      await swapBars(bars[i], bars[j]);
    }

    bars[j].style.backgroundColor = 'blue';
  }

  // Swap pivot into the correct position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  await swapBars(bars[i + 1], bars[high]);

  bars[high].style.backgroundColor = 'blue';
  return i + 1;
}

async function quickSortHelper(low, high, bars) {
  if (low < high) {
    let pivotIndex = await partition(low, high, bars);

    await quickSortHelper(low, pivotIndex - 1, bars);
    await quickSortHelper(pivotIndex + 1, high, bars);
  }
}

async function quickSort() {
  const bars = document.querySelectorAll('.bar');
  isSorting = true;
  await quickSortHelper(0, array.length - 1, bars);
  isSorting = false;
}


async function quickSort() {
  const bars = document.querySelectorAll('.bar');
  isSorting = true;
  await quickSortHelper(0, array.length - 1, bars);
  isSorting = false;
}

// Merge Sort
async function merge(start, mid, end, bars) {
  let left = start;
  let right = mid + 1;
  let temp = [];

  while (left <= mid && right <= end) {
    if (array[left] <= array[right]) {
      temp.push(array[left++]);
    } else {
      temp.push(array[right++]);
    }
  }

  while (left <= mid) temp.push(array[left++]);
  while (right <= end) temp.push(array[right++]);

  // Apply the sorted section back to the bars with animation
  for (let i = start; i <= end; i++) {
    array[i] = temp[i - start];
    bars[i].style.height = `${array[i]}px`;
    bars[i].style.backgroundColor = 'red';

    await delay();
    bars[i].style.backgroundColor = 'blue';
  }
}

async function mergeSortHelper(start, end, bars) {
  if (start >= end) return;

  let mid = Math.floor((start + end) / 2);

  await mergeSortHelper(start, mid, bars);
  await mergeSortHelper(mid + 1, end, bars);

  await merge(start, mid, end, bars);
}

async function mergeSort() {
  const bars = document.querySelectorAll('.bar');
  isSorting = true;
  await mergeSortHelper(0, array.length - 1, bars);
  isSorting = false;
}


// Add functionality to each button
function startSort(algorithm) {
  if (isSorting) return alert("Wait for the current sorting to finish!");
  resetBarColors();

  switch (algorithm) {
    case 'bubble':
      bubbleSort();
      break;

    case 'quick':
      quickSort();
      break;

    case 'merge':
      mergeSort();
      break;

    case 'insertion':
      insertionSort();
      break;

    case 'selection':
      selectionSort();
      break;

    default:
      alert('Sorting algorithm not implemented yet!');
  }
}

// Initialize the visualizer with randomized bars
randomizeArray();


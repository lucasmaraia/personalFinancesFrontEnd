const baseUrl = 'http://localhost:8080';
const chartCanvas = document.getElementById('myChart').getContext('2d');
const transactionsList = document.getElementById('transactions');
const transactionForm = document.getElementById('transactionForm');

let myChart;

transactionForm.addEventListener('submit', handleFormSubmit);

document.addEventListener('DOMContentLoaded', loadTransactions);

async function handleFormSubmit(event) {
    event.preventDefault();

    const transaction = getTransactionFromForm();

    try {
        const newTransaction = await addTransaction(transaction);
        showSuccessToast(newTransaction.description);
        displayTransaction(newTransaction);
        updateChart();
        transactionForm.reset();
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
}

function getTransactionFromForm() {
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const dateInput = document.getElementById('date').value;
    const date = new Date(dateInput).toISOString().split('T')[0];

    return {
        description,
        amount,
        date
    };
}

async function addTransaction(transaction) {
    const response = await fetch(`${baseUrl}/transaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });

    if (!response.ok) {
        throw new Error('Failed to add transaction');
    }

    return await response.json();
}

async function loadTransactions() {
    try {
        const transactions = await fetchTransactions();
        transactions.forEach(displayTransaction);
        updateChart();
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

async function fetchTransactions() {
    const response = await fetch(`${baseUrl}/transaction`);

    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }

    return await response.json();
}

function displayTransaction(transaction) {
    const listItem = document.createElement('li');
    listItem.textContent = formatTransactionText(transaction);

    const deleteButton = createDeleteButton(transaction, listItem);
    listItem.appendChild(deleteButton);
    
    transactionsList.appendChild(listItem);
}

function formatTransactionText(transaction) {
    const transactionDate = new Date(transaction.date);
    const formattedDate = transactionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `${transaction.description} - R$: ${transaction.amount} - Date: ${formattedDate}`;
}

function createDeleteButton(transaction, listItem) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
        try {
            await deleteTransaction(transaction.id);
            showDeleteToast(transaction);
            listItem.remove();
            updateChart();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    });
    return deleteButton;
}

async function deleteTransaction(transactionId) {
    const response = await fetch(`${baseUrl}/transaction/${transactionId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete transaction');
    }

    return await response.json();
}

function updateChart() {
    fetchTransactions()
        .then(transactions => {
            const { labels, amounts } = prepareChartData(transactions);

            if (!myChart) {
                createChart(labels, amounts);
            } else {
                updateChartData(labels, amounts);
            }
        })
        .catch(error => {
            console.error('Error updating chart:', error);
        });
}

function prepareChartData(transactions) {
    const monthlyTotals = calculateMonthlyTotals(transactions);
    const sortedMonthYears = Object.keys(monthlyTotals).sort();

    const labels = sortedMonthYears.map(monthYear => {
        const [year, month] = monthYear.split('-');
        return `${getMonthName(parseInt(month) - 1)} ${year}`;
    });

    const amounts = Object.values(monthlyTotals);

    return { labels, amounts };
}

function calculateMonthlyTotals(transactions) {
    return transactions.reduce((totals, transaction) => {
        const monthYear = transaction.date.substring(0, 7);
        totals[monthYear] = (totals[monthYear] || 0) + parseFloat(transaction.amount);
        return totals;
    }, {});
}

function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

function createChart(labels, amounts) {
    myChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Amount',
                data: amounts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChartData(labels, amounts) {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = amounts;
    myChart.update();
}

function showSuccessToast(description) {
    showToast(`Transaction ${description} saved with success`, 'success');
}

function showDeleteToast(transaction) {
    showToast(`Transaction ${transaction.description} deleted with success`, 'info');
}

function downloadExcel(){
    window.location.href = baseUrl + "/transaction/excel";
}

function showToast(text, icon) {
    $.toast({
        text,
        icon,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 7000,
        stack: 5,
        position: 'top-right',
        textAlign: 'center',
        loader: true,
        loaderBg: '#9EC600',
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {}
    });
}

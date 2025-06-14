// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCd5u6BB6jY0iUTbJV4itMlIztOR9JLKwk",
    authDomain: "expenseincomemanagingapp.firebaseapp.com",
    projectId: "expenseincomemanagingapp",
    storageBucket: "expenseincomemanagingapp.firebasestorage.app",
    messagingSenderId: "932078408638",
    appId: "1:932078408638:web:7f8c3df9c2b3c71f839fef",
    measurementId: "G-3FHFVL5EZF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a refenrence to the service
const db = getFirestore(app)

// Saves a transaction object to the database.
export async function addExpense(expense) {
    const personDoc = await addDoc(collection(db, 'expenses'), expense)
    return personDoc.id
}
export async function addIncome(income) {
    const personDoc = await addDoc(collection(db, 'incomes'), income)
    return personDoc.id
}

// Gets all the transactions from the database.
export async function getExpenses() {
    let expenseDocs = await getDocs(collection(db, 'expenses'))

    let expenses = []

    expenseDocs.forEach((expenseDoc) => {
        expenses.push({ id: expenseDoc.id, ...expenseDoc.data() })
    })
    // Sort by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date))

    return expenses
}
export async function getIncomes() {
    const incomeDocs = await getDocs(collection(db, 'incomes'))

    let incomes = []

    incomeDocs.forEach((incomeDoc) => {
        incomes.push({ id: incomeDoc.id, ...incomeDoc.data() })
    })
    // Sort by date (newest first)
    incomes.sort((a, b) => new Date(b.date) - new Date(a.date))

    return incomes
}
// Deletes a transaction from the database.
export async function deleteExpense(id) {
    await deleteDoc(doc(db, 'expenses', id))
}
export async function deleteIncome(id) {
    await deleteDoc(doc(db, 'incomes', id))
}

export async function getWeeklyTotals() {
    const incomeDocs = await getDocs(collection(db, "incomes"))
    const expenseDocs = await getDocs(collection(db, "expenses"))

    const now = new Date()
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 6)

    const isWithinLastWeek = (dateStr) => {
        const date = new Date(dateStr)
        return date >= oneWeekAgo && date <= now
    }

    let incomeTotal = 0
    let expenseTotal = 0

    incomeDocs.forEach(doc => {
        const { amount, date } = doc.data()
        if (amount && date && isWithinLastWeek(date)) {
            incomeTotal += Number(amount)
        }
    })

    expenseDocs.forEach(doc => {
        const { amount, date } = doc.data()
        if (amount && date && isWithinLastWeek(date)) {
            expenseTotal += Number(amount)
        }
    })

    return { incomeTotal, expenseTotal }
}

export async function getMonthlyExpenses(year, month) {
    const expenses = []
    const snapshot = await getDocs(collection(db, "expenses"))

    snapshot.forEach((doc) => {
        const data = doc.data()
        const date = new Date(data.date)

        if (
            date.getFullYear() === year &&
            date.getMonth() + 1 === month
        ) {
            expenses.push({
                date: date,
                amount: data.amount,
            })
        }
    })

    return expenses
}
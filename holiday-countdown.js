'use strict'

function getYear(date) {
    return date.getUTCFullYear()
}

function thisYear() {
    return getYear(new Date())
}

function getMonth(date) {
    return date.getUTCMonth() + 1
}

function thisMonth() {
    return getMonth(new Date())
}

function getDay(date) {
    return date.getDate()
}

function thisDay() {
    return getDay(new Date())
}

function isPast(month, day) {
    return thisMonth() > month || (thisMonth() == month && thisDay() > day)
}

function yearPast(month, day) {
    return isPast(month, day) ? thisYear() + 1: thisYear()
}

function nextOccurrence(month, day) {
    return `${month}-${day}-${thisYear() + (isPast(month, day) ? 1 : 0)}`
}

function diffTime(date1) {
    return function(date2) {
        return Math.abs( date1.getTime() - date2.getTime())
    }
}

function today() {
    return new Date(`${thisYear()}-${thisMonth()}-${thisDay()}`)
}

function diffTimeNow(date) {
    return diffTime(today())(date)
}

function getFullDays(n) {
    return Math.ceil(n / (1000 * 60 * 60 * 24))
}

function diffDays(date1) {
    return function(date2) {
        return getFullDays(diffTime(date1)(date2))
    }
}

function diffDaysNow(date) {
    return diffDays(today())(date)
}

function daysUntil(month, day) {
    return diffDaysNow(new Date(nextOccurrence(month, day)))
}

function getEaster() {
    const year = thisYear(),
          f = Math.floor,
          G = year % 19,
          C = f(year / 100),
          H = (C - f(C / 4) - f((8 * C + 13)/25) + 19 * G + 15) % 30,
          I = H - f(H/28) * (1 - f(29/(H + 1)) * f((21-G)/11)),
          J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
          L = I - J,
          month = 3 + f((L + 40)/44),
          day = L + 28 - 31 * f(month / 4)

    if (isPast(month,day))
        return getEaster(year + 1)
    return [month, day, year]
}

function getThanksgiving() {
    const date1 = new Date(`thursday november ${thisYear()}`),
          getData = date => [getMonth(date), getDay(date) + 21],
          getDataWithYear = date => getData(date).concat(getYear(date))
    if (isPast(...getData(date1)))
        return getDataWithYear(new Date(`thursday november ${thisYear() + 1}`))
    return getDataWithYear(date1)
}

function toTimeString(month, day, year=thisYear()) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[month - 1]} ${day}, ${year !== null ? year : ''}`
}

function toTimeStringYearPast(month, day) {
    return toTimeString(month, day, yearPast(month, day))
}

function getHoliday(month, day) {
    return {
        days: () => daysUntil(month, day),
        date: () => toTimeStringYearPast(month, day)
    }
}

const holidays = {
    'Christmas': getHoliday(12, 25),
    'Valentines': getHoliday(2, 14),
    'Halloween': getHoliday(10, 31),
    'Saint Patrick\'s Day': getHoliday(3, 17),
    'New Year\'s Eve': getHoliday(12, 31),
    'Easter': {
        days: () => diffDaysNow(new Date(getEaster().join(' '))),
        date: () => toTimeString(...getEaster())
    },
    'Thanksgiving': {
        days: () => diffDaysNow(new Date(getThanksgiving().join(' '))),
        date: () => toTimeString(...getThanksgiving())
    }
}

module.exports.holidays = holidays
module.exports.getEaster = getEaster
module.exports.getThanksgiving = getThanksgiving
module.exports.daysUntil = daysUntil
module.exports.diffDaysNow = diffDaysNow
module.exports.diffDays = diffDays
module.exports.getFullDays = getFullDays
module.exports.diffTimeNow = diffTimeNow
module.exports.diffTime = diffTime
module.exports.nextOccurrence = nextOccurrence
module.exports.isPast = isPast
module.exports.thisDay = thisDay
module.exports.getDay = getDay
module.exports.thisMonth = thisMonth
module.exports.getMonth = getMonth
module.exports.thisYear = thisYear
module.exports.getYear = getYear
module.exports.today = today
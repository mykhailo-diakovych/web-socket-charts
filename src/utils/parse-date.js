export const dateConvert = () => {
    const date = new Date()
    const hours = date.getHours()
    const minuts = date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes()
    const seconds = date.getSeconds() < 9 ? '0' + date.getSeconds() : date.getSeconds()
    return hours + ':' + minuts + ':' + seconds
}
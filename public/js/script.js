
//Show alert (Thông báo cập nhập thành công hay chưa)
const showAlert = document.querySelector("[show-alert]")

if(showAlert){
   const dataTime = showAlert.getAttribute("data-time")
   const closeAlert = showAlert.querySelector("[close-alert]")
   setTimeout(()=>{
       showAlert.classList.add("alert-hidden")
   }, parseInt(dataTime))
   
   closeAlert.addEventListener("click", ()=>{
       showAlert.classList.add("alert-hidden")
   })
}

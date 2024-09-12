//----------------------------------------------------------------------
//Change status (Thay đổi trạng thái của 1 sản phẩm)
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")

const formChangeStatus = document.querySelector("#form-change-status")
const path = formChangeStatus.getAttribute("data-path")

if(buttonChangeStatus.length > 0){
    buttonChangeStatus.forEach(button=>{
        button.addEventListener("click", (event)=>{
            event.preventDefault();
            const status = button.getAttribute("data-status")
            const id = button.getAttribute("data-id");

            let newStatus = status === "active" ? "inactive" : "active";

            const action = path + `/${newStatus}/${id}?_method=PATCH` //- Vì HTML không hỗ trợ phương thức `PATCH`, 
                                                                      //  chúng ta sử dụng `method-override`. Query string `?_method=PATCH` 
                                                                      //  sẽ giúp biến yêu cầu gửi đi (với phương thức mặc định là `POST`) 
                                                                      //  thành yêu cầu `PATCH` khi đến server.

            formChangeStatus.action =  action

            formChangeStatus.submit();//Bản chất là nó gửi cái action lên server
        })
    })
}

//----------------------------------------------------------------------
//Xóa sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]")

if(buttonDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("data-path")
    
    buttonDelete.forEach(button =>{
        button.addEventListener("click", ()=>{
            const inConfirm = confirm("Xóa sản phẩm")
            if(inConfirm){
                const id = button.getAttribute("data-id")

                const newPath = path + `/${id}?_method=DELETE`

                formDeleteItem.action = newPath
                formDeleteItem.submit()//Bản chất là nó gửi cái action lên server
            }
        })
   })
}


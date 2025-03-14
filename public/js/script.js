(()=>{
    "use-strict";
    //fetch all the forms go in notes
    const forms = document.querySelectorAll(".needs-validation");
    //loop over them and prevent submission
    Array.from(forms).forEach((form)=>{
        form.addEventListener(
            "submit",
            (event) =>{
                if(!form.checkValidity()){
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },
            false
        );
    });
})();
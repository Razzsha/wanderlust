(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
    console.log("clicked");
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo) {
        if (info.style.display != "inline") {
            info.style.display = "inline";
        } else {
            info.style.display = "none";
        }
    }
});


// Prevent dropdown from closing when clicking inside
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.dropdown-menu').forEach(function (dropdown) {
        dropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
});
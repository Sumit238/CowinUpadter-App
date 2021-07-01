const stateSelected = document.querySelector('#state')

function setDistricts() {
    const districtsOptions = document.querySelector('#district')
    axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateSelected.value}`)
        .then(function (response) {
            districtsOptions.innerHTML = '<option hidden disabled selected value>(select an option)</option>';
            for (let district of response.data.districts) {
                var option = document.createElement("OPTION");
                option.innerText = district.district_name;
                option.value = district.district_id;
                districtsOptions.appendChild(option);
            }

        })
        .catch(function (error) {
            alert('failed to load districts')

        })
}
stateSelected.addEventListener('change', setDistricts)




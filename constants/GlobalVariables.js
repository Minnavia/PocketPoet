const GlobalVariables = {
    modalOpen: true,

    openModal: () => {
        GlobalVariables.modalOpen = !GlobalVariables.modalOpen;
        console.log("background accessible?", GlobalVariables.modalOpen)
    }
}

export default GlobalVariables;
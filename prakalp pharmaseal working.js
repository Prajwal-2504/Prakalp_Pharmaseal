function renderQRCode(usermedicinetext) {
    QRCodehtml.innerHTML = '';
    new QRCode(QRCodehtml, {
        text: usermedicinetext, 
        width: 160, 
        height: 160 
    });
};

function resetformsandbtns(){
    transferownerform.reset();
    transferownerform.style.display = 'none';
    transferownerform.innerHTML = ``;
    transferownerform.onsubmit = null;
    scanverifyform.reset();
    scanVerifyBtn.disabled = false;
    verifyResult.textContent = "";
    verifyResult.style.display = 'none';
    transferOwnerBtn.textContent = "";
    transferOwnerBtn.style.display = 'none';
}

function transferformsandbtns(){
    transferOwnerBtn.style.display = "block";
    transferOwnerBtn.onclick = () => {
        transferownerform.style.display = 'block';
        transferOwnerBtn.disabled = true;
        scanverifyform.reset();
        scanverifyform.style.display = 'none';
        scanVerifyBtn.disabled = true;
        createPackform.reset();
        main_data_create.style.display = 'none';
        createPackform.style.display = 'none';
        createPackBtn.disabled = false;
    };
}

function timestamp(param) {
    if(param)   return `SIH-PK-${Date.now()}`; // unique timestamp ID
    const now = new Date();
    const currentdate = now.getDate().toString().padStart(2, '0');
    const currentmonth = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const currentyear = now.getFullYear();
    const currenthours = now.getHours().toString().padStart(2, '0');
    const currentminutes = now.getMinutes().toString().padStart(2, '0');
    const currentseconds = now.getSeconds().toString().padStart(2, '0');
    return `${currentyear}-${currentmonth}-${currentdate} at ${currenthours}:${currentminutes}:${currentseconds}`;    
};

const stages = ["Manufacturer", "Warehouse", "Distributor", "Retailer", "Clinic", "Customer"];

const QRCodehtml = document.getElementById('qrcode');
const createPackform = document.getElementById('createPack');
const scanverifyform = document.getElementById('scan_verify');
const transferownerform = document.getElementById('transfer_owner');
const infosec = document.getElementById('info_sec');
const main_data_create = document.getElementById('main_data_create');
const exportbtn = document.getElementById('export_med_data');
const lastPackIdInput = document.getElementById('PackId');
const verifyIdInput = document.getElementById('verifyID');
const verifyResult = document.getElementById('verifyResult');
const NameInput = document.getElementById('m_name');
const ManufacturerInput = document.getElementById('m_manufacturer');
const BatchInput = document.getElementById('m_batch');
const ManInput = document.getElementById('m_man');
const ExpInput = document.getElementById('m_exp');
const QtyInput = document.getElementById('m_qty');
const QtyUnitInput = document.getElementById('m_qty_unit');
const locationInput = document.getElementById('m_location');
const ManagerNameInput = document.getElementById('m_manager_name');
const ManagerEmailInput = document.getElementById('m_manager_email');
const CompanyEmailInput = document.getElementById('m_company_email');
const LicenseInput = document.getElementById('m_license');

const createPackBtn = document.getElementById('createPackBtn');
const scanVerifyBtn = document.getElementById('scanVerifyBtn');
const transferOwnerBtn = document.getElementById('transferOwnerBtn');
const infoBtn = document.getElementById('infoBtn');

createPackBtn.onclick = () => {
    createPackform.style.display = 'block';
    createPackBtn.disabled = true;
    scanverifyform.reset();
    scanverifyform.style.display = 'none';
    transferownerform.reset();
    transferownerform.style.display = 'none';
    transferOwnerBtn.disabled = false;
    if(transferOwnerBtn.style.display !== 'block')    scanVerifyBtn.disabled = false;
};
scanVerifyBtn.onclick = () => {
    scanverifyform.style.display = 'block';
    scanVerifyBtn.disabled = true;
    createPackform.reset();
    main_data_create.style.display = 'none';
    createPackform.style.display = 'none';
    createPackBtn.disabled = false;
};
infoBtn.onclick = () => {
    if(infoBtn.textContent === "Show Website Information") {
        infoBtn.textContent = "Hide Website Information";
        infosec.style.display = 'block';
    }
    else {
        infoBtn.textContent = "Show Website Information";
        infosec.style.display = 'none';
    }
};

createPackform.onsubmit = createPack;
scanverifyform.onsubmit = verifyPack;
exportbtn.onclick = exportMedData;

window.onload = () => renderQRCode('');

let orderedData = {}; // to hold ordered data for display in verification
const batchFields = {
    Warehouse: "Batch_ID_of_Medicine_received_from_Manufacturer",
    Distributor: "Batch_ID_of_Medicine_received_from_Warehouse",
    Retailer: "Batch_ID_of_Medicine_received_from_Distributor",
    Clinic: "Batch_ID_of_Medicine_received_from_Retailer",
    Customer: "Batch_ID_of_Medicine_received_from_Clinic"
};
const quantityFields = {
    Warehouse: "Quantity_Received_from_Manufacturer",
    Distributor: "Quantity_Received_from_Warehouse",
    Retailer: "Quantity_Received_from_Distributor",
    Clinic: "Quantity_Received_from_Retailer",
    Customer: "Quantity_Received_from_Clinic"
};

const requiredFields = {
    Manufacturer: [
        "Name_of_Medicine", "Owning_Company", "Medicine_Batch", "Manufacturing_Date_of_Medicine",
        "Expiry_Date_of_Medicine", "Quantity", "Quantity_Unit", "Location_of_Manufacturing_Plant", "Plant_Manager",
        "Manager_Email", "Company_Email", "License_Number", "Added_to_Database"
    ],
    Warehouse: [
        "Batch_ID_of_Medicine_received_from_Manufacturer", "Warehouse_Name", "Warehouse_Location",
        "Warehouse_Manager", "Manager_Email", "Quantity_Received_from_Manufacturer", "Quantity_Unit", "DateTime_Received",
        "Storage_Condition", "Added_to_Database"
    ],
    Distributor: [
        "Batch_ID_of_Medicine_received_from_Warehouse", "Distributor_Name", "Distributor_Location",
        "Distributor_Manager", "Manager_Email", "Quantity_Received_from_Warehouse", "Quantity_Unit", "DateTime_Received",
        "Storage_Condition", "Added_to_Database"
    ],
    Retailer: [
        "Batch_ID_of_Medicine_received_from_Distributor", "Retailer_Name", "Retailer_Location",
        "Retailer_Manager", "Manager_Email", "Quantity_Received_from_Distributor", "Quantity_Unit", "DateTime_Received",
        "Storage_Condition", "Added_to_Database"
    ],
    Clinic: [
        "Batch_ID_of_Medicine_received_from_Retailer", "Clinic_Name", "Clinic_Location",
        "Clinic_Manager", "Manager_Email", "Quantity_Received_from_Retailer", "Quantity_Unit", "DateTime_Received",
        "Storage_Condition", "Added_to_Database"
    ],
    Customer: [
        "Batch_ID_of_Medicine_received_from_Clinic", "Customer_Name", "Customer_Email",
        "Quantity_Received_from_Clinic", "Quantity_Unit", "DateTime_Received", "Added_to_Database"
    ]
};

function createPack(e) {
    e.preventDefault();
    const name = NameInput.value.trim();
    const manufacturer = ManufacturerInput.value.trim();
    const batch = BatchInput.value.trim();
    const man = ManInput.value.trim();
    const exp = ExpInput.value.trim();
    const qty = QtyInput.value.trim();
    const qtyUnit = QtyUnitInput.value.trim();
    const location = locationInput.value.trim();
    // Get new required fields
    const managerName = ManagerNameInput.value.trim();
    const managerEmail = ManagerEmailInput.value.trim();
    const companyEmail = CompanyEmailInput.value.trim();
    const license = LicenseInput.value.trim();

    const packId = timestamp(true); // unique pack ID

    database.doc(packId).set({
        Manufacturer: {
            Name_of_Medicine: name,
            Owning_Company: manufacturer,
            Medicine_Batch: batch,
            Manufacturing_Date_of_Medicine: man,
            Expiry_Date_of_Medicine: exp,
            Quantity: qty,
            Quantity_Unit: qtyUnit,
            Location_of_Manufacturing_Plant: location,
            Plant_Manager: managerName,
            Manager_Email: managerEmail,
            Company_Email: companyEmail,
            License_Number: license,
            Added_to_Database: timestamp()
        }
    }).then(response => {
        renderQRCode(packId);
        lastPackIdInput.textContent = packId;
        main_data_create.style.display = 'block';
        createPackform.reset();
        main_data_create.style.display = 'none';

        navigator.clipboard.writeText(packId);
        alert(`Pack created : ${packId}, and copied to clipboard. \nPlease save this ID as it will be required for future verification and ownership transfers.`);
    }).catch(error => alert(`Error creating new medicine pack in database : ${error}`));
}

async function verifyPack(e) {
    e.preventDefault();
    const id = verifyIdInput.value.trim();
    try {
        const snapshot = await database.get();
        if (snapshot.empty) return verifyResult.textContent = "No pack IDs are currently registered. If you are a Manufacturer, create one to add to the database.";
        const doc = await database.doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            const presentStages = stages.filter(stage => data[stage]); // only stages that exist

            if (presentStages.length === 0)     return verifyResult.textContent = `Pack ID ${id} exists but no supply chain data found. It may be tampered.`;

            // --- Robust tampering/invalid checks ---
            let errorMsg = "";
            let whathappened = "";

            verification : {
                // 1. Check for missing intermediate stages (supply chain break)
                for (let i = 0; i < presentStages.length; i++) {
                    if (stages[i] !== presentStages[i]) {
                        errorMsg = `Missing Stage : "${stages[i]}". This indicates medicine has been tampered!`;
                        whathappened = "exists but its supply chain is broken";
                        break verification;
                    }
                }
                // 2. Check for presence of all required fields at every present stage
                for (const stage of presentStages) {
                    const stageData = data[stage];
                    if (!stageData) {
                        errorMsg = `Missing data for stage "${stage}"`;
                        whathappened = "is tampered";
                        break verification;
                    }
                    for (const field of requiredFields[stage]) {
                        if (!(field in stageData)) {
                            errorMsg = `Missing required data field "${field}" in stage "${stage}"`;
                            whathappened = "is tampered";
                            break verification;
                        }
                    }
                }
                // 3. Check for batch, quantity and quantity unit mismatches at every stage

                let manufacturerExp = null, manufacturerMan = null, manufacturerQty = null, manufacturerBatch = null;
                if (data.Manufacturer) {
                    manufacturerExp = data.Manufacturer.Expiry_Date_of_Medicine;
                    manufacturerMan = data.Manufacturer.Manufacturing_Date_of_Medicine;
                    manufacturerQty = parseInt(data.Manufacturer.Quantity, 10);
                    manufacturerBatch = data.Manufacturer.Medicine_Batch;
                }

                for (let i = 1; i < presentStages.length; i++) {
                    const stage = presentStages[i];
                    const stageData = data[stage];
                    //3a. Batch check
                    const batchField = batchFields[stage];
                    if (stageData && batchField && stageData[batchField] !== undefined) {
                        const stageBatch = stageData[batchField];
                        if (manufacturerBatch !== null && stageBatch !== manufacturerBatch) {
                            errorMsg = `Batch ID at ${stage} (${stageBatch}) does not match Manufacturer Batch Id (${manufacturerBatch})`;
                            whathappened = "is tampered";
                            break verification;
                        }
                    }
                    //3b. Quantity check
                    const qtyField = quantityFields[stage];
                    if (stageData && qtyField && stageData[qtyField] !== undefined) {
                        const stageQty = parseInt(stageData[qtyField], 10);
                        if (manufacturerQty !== null && stageQty !== manufacturerQty) {
                            errorMsg = `Quantity at ${stage} (${stageQty}) does not match Manufacturer Quantity (${manufacturerQty})`;
                            whathappened = "is tampered";
                            break verification;
                        }
                    }
                    //3c. Quantity Unit check
                    if (stageData && stageData.Quantity_Unit !== undefined) {
                        const stageQtyUnit = stageData.Quantity_Unit;
                        if (QtyUnitInput.value.trim() && stageQtyUnit !== QtyUnitInput.value.trim()) {
                            errorMsg = `Quantity Unit at ${stage} (${stageQtyUnit}) does not match Manufacturer Quantity Unit (${QtyUnitInput.value.trim()})`;
                            whathappened = "is tampered";
                            break verification;
                        }
                    }
                }
                // 4. Check if manufacturing date is after expiry date
                if (manufacturerMan && manufacturerExp) {
                    const manDate = new Date(manufacturerMan);
                    const expDate = new Date(manufacturerExp);
                    if (manDate > expDate) {
                        errorMsg = `Manufacturing date (${manufacturerMan}) is after expiry date (${manufacturerExp})`;
                        whathappened = "is invalid";
                        break verification;
                    }
                }
                // 5. Check if any received date is after expiry date (expired medicine)
                if (manufacturerExp) {
                    const expDate = new Date(manufacturerExp);
                    for (let i = 1; i < presentStages.length; i++) {
                        const stage = presentStages[i];
                        const stageData = data[stage];
                        if (stageData && stageData.DateTime_Received) {
                            const receivedDate = new Date(stageData.DateTime_Received);
                            if (receivedDate > expDate) {
                                errorMsg = `Medicine was received at "${stage}" on ${stageData.DateTime_Received} after expiry date (${manufacturerExp})`;
                                whathappened = "is expired";
                                break verification;
                            }
                        }
                    }
                }
                //6. Check if date of add to database is after expiry date of medicine for all stages
                for (let i = 0; i < presentStages.length; i++) {
                    const stage = presentStages[i];
                    const stageData = data[stage];
                    if (stageData && stageData.Added_to_Database) {
                        const addedDate = new Date(stageData.Added_to_Database.split(" at ")[0].replace(/\//g, '-'));
                        if (manufacturerExp) {
                            const expDate = new Date(manufacturerExp);
                            if (addedDate > expDate) {
                                errorMsg = `"Added to Database" date (${stageData.Added_to_Database}) at stage "${stage}" is after expiry date (${manufacturerExp}) of medicine`;
                                whathappened = "is expired";
                                break verification;
                            }
                        }
                    }
                }
                //7. Check if any received date is before manufacturing date of medicine
                if (manufacturerMan) {
                    const manDate = new Date(manufacturerMan);
                    for (let i = 1; i < presentStages.length; i++) {
                        const stage = presentStages[i];
                        const stageData = data[stage];
                        if (stageData && stageData.DateTime_Received) {
                            const receivedDate = new Date(stageData.DateTime_Received);
                            if (receivedDate < manDate) {
                                errorMsg = `Medicine was received at "${stage}" on ${stageData.DateTime_Received} before manufacturing date (${manufacturerMan}) of medicine`;
                                whathappened = "is tampered";
                                break verification;
                            }
                        }
                    }
                }
                //8. Check if any add to database date is before manufacturing date of medicine
                if (manufacturerMan) {
                    const manDate = new Date(manufacturerMan);
                    for (let i = 0; i < presentStages.length; i++) {
                        const stage = presentStages[i];
                        const stageData = data[stage];
                        if (stageData && stageData.Added_to_Database) {
                            const addedDate = new Date(stageData.Added_to_Database.split(" at ")[0].replace(/\//g, '-'));
                            if (addedDate < manDate) {
                                errorMsg = `"Added to Database" date (${stageData.Added_to_Database}) at stage "${stage}" is before manufacturing date (${manufacturerMan}) of medicine`;
                                whathappened = "is tampered";
                                break verification;
                            }
                        }
                    }
                }
                //9. Check if date of receiving of current stage is after date of adding to database of previous stage and before date of adding to database of current stage for every stage
                for (let i = 1; i < presentStages.length; i++) {
                    const currentStage = presentStages[i];
                    const prevStage = presentStages[i - 1];
                    const currentData = data[currentStage];
                    const prevData = data[prevStage];
                    if (currentData && currentData.DateTime_Received && prevData && prevData.Added_to_Database) {
                        const receivedDate = new Date(currentData.DateTime_Received);
                        const prevAddedDate = new Date(prevData.Added_to_Database.split(" at ")[0].replace(/\//g, '-'));
                        if (receivedDate < prevAddedDate) {
                            errorMsg = `DateTime_Received (${currentData.DateTime_Received}) at stage "${currentStage}" is before Added_to_Database (${prevData.Added_to_Database}) of previous stage "${prevStage}"`;
                            whathappened = "is tampered";
                            break verification;
                        }
                        if (currentData.Added_to_Database) {
                            const currentAddedDate = new Date(currentData.Added_to_Database.split(" at ")[0].replace(/\//g, '-'));
                            if (receivedDate > currentAddedDate) {
                                errorMsg = `DateTime_Received (${currentData.DateTime_Received}) at stage "${currentStage}" is after its own Added_to_Database (${currentData.Added_to_Database})`;
                                whathappened = "is tampered";
                                break verification;
                            }
                        }
                    }
                }
                // All checks passed
                // End of robust tampering/invalid checks
            }
            orderedData = {};
            for (const stage of stages) {
                if (data[stage]) {
                    orderedData[stage] = { ...data[stage] };
                    if (orderedData[stage].Quantity_Received !== undefined)    orderedData[stage].Quantity_Received = parseInt(orderedData[stage].Quantity_Received, 10);
                    if (stage === "Manufacturer" && orderedData[stage].Quantity !== undefined)    orderedData[stage].Quantity = parseInt(orderedData[stage].Quantity, 10);
                }
            }
            if (errorMsg) {
                verifyResult.textContent = `Pack ID ${id} ${whathappened}! \n${errorMsg}.\nOwnership cannot be transferred further!\n\n${JSON.stringify(orderedData, null, 2)}`;
                transferownerform.innerHTML = "";
                transferownerform.style.display = 'none';
                transferownerform.onsubmit = null; // remove any previous submit handler
            } else {
                const currentStage = presentStages[presentStages.length - 1];
                verifyResult.textContent = `Pack ID ${id} successfully verified! \nThis pack is valid and exists in our database. \nCurrent stage: ${currentStage} \nSupply chain details:\n\n${JSON.stringify(orderedData, null, 2)}`;
                appendtransfer(id, currentStage); // enable transfer for next stage
            }
        }
        else verifyResult.textContent = `No records found for Pack ID "${id}". This indicates that the pack ID or QR Code printed \nover the medicine is invalid as it does not exist in our database.`;
    } catch (error) {
        verifyResult.textContent = `An error occurred while verifying : ${error}. Please try again.`;
        //console.error(error);
    }
    finally {
        verifyResult.style.display = 'block';
    }
}

async function exportMedData() {
    const id = verifyIdInput.value.trim(); // same input field as verifyPack
    if (!id) {
        alert("Please enter a Pack ID to export.");
        verifyIdInput.focus();
        return;
    }
    try {
        // Step 1: check if any documents exist at all
        const snapshot = await database.get();
        if (snapshot.empty)    return alert("No pack IDs are currently registered. If you are a Manufacturer, create one to add to the database.");
        // Step 2: get the specific document by Pack ID
        const doc = await database.doc(id).get();
        if (!doc.exists)    return alert(`No records found for Pack ID "${id}". This indicates the pack ID is invalid or not yet registered.`);
        const data = doc.data();
        // Step 3: check if data is non-empty
        if (!data || Object.keys(data).length === 0)    return alert(`Pack ID ${id} exists but no supply chain data found. It may be tampered.`);
        // Step 4: prepare and trigger download of JSON file
        const now = new Date();
        const fileName = `${id} medchain data exported on ${now.getDate().toString().padStart(2, '0')}／${(now.getMonth() + 1).toString().padStart(2, '0')}／${now.getFullYear()} at ${now.getHours().toString().padStart(2, '0')}﹕${now.getMinutes().toString().padStart(2, '0')}﹕${now.getSeconds().toString().padStart(2, '0')}.json`;
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url); // clean up
        alert(`Data for Pack ID ${id} has been downloaded successfully.`);
    } catch (error) {
        alert(`An error occurred while exporting data: ${error}`);
    }
}

function appendtransfer(packid, current_stage) {
    if (current_stage === "Manufacturer") transferownerfrommanufacturertowarehouse(packid);
    else if (current_stage === "Warehouse") transferownerfromwarehousetodistributor(packid);
    else if (current_stage === "Distributor") transferownerfromdistributortoretailer(packid);
    else if (current_stage === "Retailer") transferownerfromretailertoclinic(packid);
    else if (current_stage === "Clinic") transferownerfromclinictocustomer(packid);
    else if (current_stage === "Customer") {
        transferownerform.innerHTML = `
            <h2>This medicine has already reached the Customer. No further transfers allowed.</h2>
        `;
        transferownerform.onsubmit = null; // remove any previous submit handler
    }
    else{
        transferownerform.innerHTML = `
            <h2>Invalid current stage: ${current_stage}. This means medicine has been tampered with and has invalid data despite being in our database. Ownership transfer not possible.</h2>
        `;
        transferownerform.onsubmit = null; // remove any previous submit handler
    }
}

function transferownerfrommanufacturertowarehouse(packid) {
    transferownerform.innerHTML = `
        <h2>Transfer Ownership: Manufacturer → Warehouse</h2>
        <label for="wh_pack">Pack ID:</label>
        <input type="text" id="wh_pack" name="wh_pack" value="${packid}" readonly required>
        <label for="wh_new_owner">New Owner Category:</label>
        <input type="text" id="wh_new_owner" name="wh_new_owner" value="Warehouse" readonly required>
        <label for="wh_batch">Batch ID:</label>
        <input type="text" id="wh_batch" name="wh_batch" placeholder="e.g., BATCH-2025-001" required>
        <label for="wh_warehouse_name">Warehouse Name:</label>
        <input type="text" id="wh_warehouse_name" name="wh_warehouse_name" placeholder="e.g., MedLife Central Storage" required>
        <label for="wh_warehouse_loc">Warehouse Location:</label>
        <input type="text" id="wh_warehouse_loc" name="wh_warehouse_loc" placeholder="e.g., Bengaluru, Karnataka, India" required>
        <label for="wh_responsible_name">Warehouse Manager Name:</label>
        <input type="text" id="wh_responsible_name" name="wh_responsible_name" placeholder="e.g., Arjun Mehta" required>
        <label for="wh_responsible_email">Warehouse Manager Email ID:</label>
        <input type="email" id="wh_responsible_email" name="wh_responsible_email" placeholder="e.g., arjun.mehta@medlife.com" required>
        <label for="wh_qty_received">Quantity of Medicine Received from Manufacturer:</label>
        <input type="number" id="wh_qty_received" name="wh_qty_received" placeholder="e.g., 5000 strips" required>
        <label for="wh_qty_unit">Quantity Unit:</label>
        <input type="text" id="wh_qty_unit" name="wh_qty_unit" placeholder="e.g., strips, tablets, g" required>
        <label for="wh_received_time">Date and Time of Receiving the Medicine:</label>
        <input type="datetime-local" id="wh_received_time" name="wh_received_time" required>
        <label for="wh_storage_condition">Storage Condition of Medicine (e.g., temperature, humidity):</label>
        <input type="text" id="wh_storage_condition" name="wh_storage_condition" placeholder="e.g., 2–8°C, 60% RH" required>
        <button type="submit">Transfer Ownership</button>
        <button type="reset">Reset Form</button>
    `;
    
    transferownerform.onsubmit = (e) => {
        e.preventDefault();

        // Only handle if Manufacturer → Warehouse form is present
        const wh_pack = document.getElementById('wh_pack');
        if (!wh_pack) return;

        // Get all values from the finalized form
        const packId = document.getElementById('wh_pack').value.trim();
        if(packId !== packid)    return alert("Pack ID mismatch. Please do not change the Pack ID field.");
        const batchId = document.getElementById('wh_batch').value.trim();
        const warehouseName = document.getElementById('wh_warehouse_name').value.trim();
        const warehouseLoc = document.getElementById('wh_warehouse_loc').value.trim();
        const responsibleName = document.getElementById('wh_responsible_name').value.trim();
        const responsibleEmail = document.getElementById('wh_responsible_email').value.trim();
        const qtyReceived = document.getElementById('wh_qty_received').value.trim();
        const qtyUnit = document.getElementById('wh_qty_unit').value.trim();
        const receivedTime = document.getElementById('wh_received_time').value.trim();
        const storageCondition = document.getElementById('wh_storage_condition').value.trim();

        database.doc(packId).set({
            Warehouse: {
                Batch_ID_of_Medicine_received_from_Manufacturer: batchId,
                Warehouse_Name: warehouseName,
                Warehouse_Location: warehouseLoc,
                Warehouse_Manager: responsibleName,
                Manager_Email: responsibleEmail,
                Quantity_Received_from_Manufacturer: qtyReceived,
                Quantity_Unit: qtyUnit,
                DateTime_Received: receivedTime,
                Storage_Condition: storageCondition,
                Added_to_Database: timestamp()
            }
        }, { merge: true }).then(response => {
            alert(`Ownership of Pack ID ${packId} successfully transferred to Warehouse: ${warehouseName}, ${warehouseLoc}`);
            resetformsandbtns();
        }).catch(error => alert(`Error transferring ownership to Warehouse in database : ${error}`));
    };
    transferOwnerBtn.textContent = "Transfer Ownership: Manufacturer → Warehouse";
    transferformsandbtns();
}

function transferownerfromwarehousetodistributor(packid) {
    transferownerform.innerHTML = `
        <h2>Transfer Ownership: Warehouse → Distributor</h2>
        <label for="dbr_pack">Pack ID:</label>
        <input type="text" id="dbr_pack" name="dbr_pack" value="\${packid}" readonly required>
        <label for="dbr_new_owner">New Owner Category:</label>
        <input type="text" id="dbr_new_owner" name="dbr_new_owner" value="Distributor" readonly required>
        <label for="dbr_batch">Batch ID:</label>
        <input type="text" id="dbr_batch" name="dbr_batch" placeholder="e.g., WH-BATCH-2025-045" required>
        <label for="dbr_distributor_name">Distributor Name:</label>
        <input type="text" id="dbr_distributor_name" name="dbr_distributor_name" placeholder="e.g., MedLife Distributors Pvt Ltd" required>
        <label for="dbr_distributor_loc">Distributor Location:</label>
        <input type="text" id="dbr_distributor_loc" name="dbr_distributor_loc" placeholder="e.g., Mumbai, Maharashtra" required>
        <label for="dbr_responsible_name">Distributor Responsible Person Name:</label>
        <input type="text" id="dbr_responsible_name" name="dbr_responsible_name" placeholder="e.g., Rahul Sharma" required>
        <label for="dbr_responsible_email">Distributor Responsible Person Email ID:</label>
        <input type="email" id="dbr_responsible_email" name="dbr_responsible_email" placeholder="e.g., rahul.sharma@medlife.com" required>
        <label for="dbr_qty_received">Quantity Received:</label>
        <input type="number" id="dbr_qty_received" name="dbr_qty_received" placeholder="e.g., 500" required>
        <label for="dbr_qty_unit">Quantity Unit:</label>
        <input type="text" id="dbr_qty_unit" name="dbr_qty_unit" placeholder="e.g., strips, tablets, g" required>
        <label for="dbr_received_time">Date and Time of Receiving the Medicine:</label>
        <input type="datetime-local" id="dbr_received_time" name="dbr_received_time" required>
        <label for="dbr_storage_condition">Storage Condition at Receipt (e.g., temperature, humidity):</label>
        <input type="text" id="dbr_storage_condition" name="dbr_storage_condition" placeholder="e.g., Temp 15 - 25°C, Humidity 55%" required>
        <button type="submit">Transfer Ownership</button>
        <button type="reset">Reset Form</button>
    `;
    
    transferownerform.onsubmit = (e) => {
        e.preventDefault();

        const dbr_pack = document.getElementById('dbr_pack');
        if (!dbr_pack) return;

        const packId = dbr_pack.value.trim();
        if(packId !== packid)    return alert("Pack ID mismatch. Please do not change the Pack ID field.");
        const batchId = document.getElementById('dbr_batch').value.trim();
        const distributorName = document.getElementById('dbr_distributor_name').value.trim();
        const distributorLoc = document.getElementById('dbr_distributor_loc').value.trim();
        const responsibleName = document.getElementById('dbr_responsible_name').value.trim();
        const responsibleEmail = document.getElementById('dbr_responsible_email').value.trim();
        const qtyReceived = document.getElementById('dbr_qty_received').value.trim();
        const qtyUnit = document.getElementById('dbr_qty_unit').value.trim();
        const receivedTime = document.getElementById('dbr_received_time').value.trim();
        const storageCondition = document.getElementById('dbr_storage_condition').value.trim();

        database.doc(packId).set({
            Distributor: {
                Batch_ID_of_Medicine_received_from_Warehouse: batchId,
                Distributor_Name: distributorName,
                Distributor_Location: distributorLoc,
                Distributor_Manager: responsibleName,
                Manager_Email: responsibleEmail,
                Quantity_Received_from_Warehouse: qtyReceived,
                Quantity_Unit: qtyUnit,
                DateTime_Received: receivedTime,
                Storage_Condition: storageCondition,
                Added_to_Database: timestamp()
            }
        }, { merge: true }).then(response => {
            alert(`Ownership of Pack ID ${packId} successfully transferred to Distributor: ${distributorName}, ${distributorLoc}`);
            resetformsandbtns();
        }).catch(error => alert(`Error transferring ownership to Distributor in database : ${error}`));
    };
    transferOwnerBtn.textContent = "Transfer Ownership: Warehouse → Distributor";
    transferformsandbtns();
}

function transferownerfromdistributortoretailer(packid) {
    transferownerform.innerHTML = `
        <h2>Transfer Ownership: Distributor → Retailer</h2>
        <label for="rtl_pack">Pack ID:</label>
        <input type="text" id="rtl_pack" name="rtl_pack" value="\${packid}" readonly required>
        <label for="rtl_new_owner">New Owner Category:</label>
        <input type="text" id="rtl_new_owner" name="rtl_new_owner" value="Retailer" readonly required>
        <label for="rtl_batch">Batch ID:</label>
        <input type="text" id="rtl_batch" name="rtl_batch" placeholder="e.g., DBR-BATCH-2025-112" required>
        <label for="rtl_retailer_name">Retailer Name:</label>
        <input type="text" id="rtl_retailer_name" name="rtl_retailer_name" placeholder="e.g., Apollo Pharmacy" required>
        <label for="rtl_retailer_loc">Retailer Location:</label>
        <input type="text" id="rtl_retailer_loc" name="rtl_retailer_loc" placeholder="e.g., Connaught Place, New Delhi" required>
        <label for="rtl_responsible_name">Retailer Responsible Person Name:</label>
        <input type="text" id="rtl_responsible_name" name="rtl_responsible_name" placeholder="e.g., Priya Verma" required>
        <label for="rtl_responsible_email">Retailer Responsible Person Email ID:</label>
        <input type="email" id="rtl_responsible_email" name="rtl_responsible_email" placeholder="e.g., priya.verma@apollo.com" required>
        <label for="rtl_qty_received">Quantity Received:</label>
        <input type="number" id="rtl_qty_received" name="rtl_qty_received" placeholder="e.g., 200" required>
        <label for="rtl_qty_unit">Quantity Unit:</label>
        <input type="text" id="rtl_qty_unit" name="rtl_qty_unit" placeholder="e.g., strips, tablets, g" required>
        <label for="rtl_received_time">Date and Time of Receiving the Medicine:</label>
        <input type="datetime-local" id="rtl_received_time" name="rtl_received_time" required>
        <label for="rtl_storage_condition">Storage Condition at Receipt (e.g., temperature, humidity):</label>
        <input type="text" id="rtl_storage_condition" name="rtl_storage_condition" placeholder="e.g., Temp 20 - 25°C, Humidity 50%" required>
        <button type="submit">Transfer Ownership</button>
        <button type="reset">Reset Form</button>
    `;

    transferownerform.onsubmit = (e) => {
        e.preventDefault();

        const rtl_pack = document.getElementById('rtl_pack');
        if (!rtl_pack) return;

        const packId = rtl_pack.value.trim();
        if(packId !== packid)    return alert("Pack ID mismatch. Please do not change the Pack ID field.");
        const batchId = document.getElementById('rtl_batch').value.trim();
        const retailerName = document.getElementById('rtl_retailer_name').value.trim();
        const retailerLoc = document.getElementById('rtl_retailer_loc').value.trim();
        const responsibleName = document.getElementById('rtl_responsible_name').value.trim();
        const responsibleEmail = document.getElementById('rtl_responsible_email').value.trim();
        const qtyReceived = document.getElementById('rtl_qty_received').value.trim();
        const qtyUnit = document.getElementById('rtl_qty_unit').value.trim();
        const receivedTime = document.getElementById('rtl_received_time').value.trim();
        const storageCondition = document.getElementById('rtl_storage_condition').value.trim();

        database.doc(packId).set({
            Retailer: {
                Batch_ID_of_Medicine_received_from_Distributor: batchId,
                Retailer_Name: retailerName,
                Retailer_Location: retailerLoc,
                Retailer_Manager: responsibleName,
                Manager_Email: responsibleEmail,
                Quantity_Received_from_Distributor: qtyReceived,
                Quantity_Unit: qtyUnit,
                DateTime_Received: receivedTime,
                Storage_Condition: storageCondition,
                Added_to_Database: timestamp()
            }
        }, { merge: true }).then(response => {
            alert(`Ownership of Pack ID ${packId} successfully transferred to Retailer: ${retailerName}, ${retailerLoc}`);
            resetformsandbtns();
        }).catch(error => alert(`Error transferring ownership to Retailer in database : ${error}`));
    };
    transferOwnerBtn.textContent = "Transfer Ownership: Distributor → Retailer";
    transferformsandbtns();
}

function transferownerfromretailertoclinic(packid) {
    transferownerform.innerHTML = `
        <h2>Transfer Ownership: Retailer → Clinic</h2>
        <label for="cln_pack">Pack ID:</label>
        <input type="text" id="cln_pack" name="cln_pack" value="\${packid}" readonly required>
        <label for="cln_new_owner">New Owner Category:</label>
        <input type="text" id="cln_new_owner" name="cln_new_owner" value="Clinic" readonly required>
        <label for="cln_batch">Batch ID:</label>
        <input type="text" id="cln_batch" name="cln_batch" placeholder="e.g., RTL-BATCH-2025-009" required>
        <label for="cln_clinic_name">Clinic Name:</label>
        <input type="text" id="cln_clinic_name" name="cln_clinic_name" placeholder="e.g., City Health Clinic" required>
        <label for="cln_clinic_loc">Clinic Location:</label>
        <input type="text" id="cln_clinic_loc" name="cln_clinic_loc" placeholder="e.g., Sector 22, Noida" required>
        <label for="cln_responsible_name">Clinic Responsible Person Name:</label>
        <input type="text" id="cln_responsible_name" name="cln_responsible_name" placeholder="e.g., Dr. Rakesh Mehta" required>
        <label for="cln_responsible_email">Clinic Responsible Person Email ID:</label>
        <input type="email" id="cln_responsible_email" name="cln_responsible_email" placeholder="e.g., rakesh.mehta@cityclinic.org" required>
        <label for="cln_qty_received">Quantity Received:</label>
        <input type="number" id="cln_qty_received" name="cln_qty_received" placeholder="e.g., 120" required>
        <label for="cln_qty_unit">Quantity Unit:</label>
        <input type="text" id="cln_qty_unit" name="cln_qty_unit" placeholder="e.g., strips, tablets, g" required>
        <label for="cln_received_time">Date and Time of Receiving the Medicine:</label>
        <input type="datetime-local" id="cln_received_time" name="cln_received_time" required>
        <label for="cln_storage_condition">Storage Condition at Receipt (e.g., temperature, humidity):</label>
        <input type="text" id="cln_storage_condition" name="cln_storage_condition" placeholder="e.g., Temp 15 - 25°C, Humidity 55%" required>
        <button type="submit">Transfer Ownership</button>
        <button type="reset">Reset Form</button>
    `;

    transferownerform.onsubmit = (e) => {
        e.preventDefault();

        const cln_pack = document.getElementById('cln_pack');
        if (!cln_pack) return;

        const packId = cln_pack.value.trim();
        if(packId !== packid)    return alert("Pack ID mismatch. Please do not change the Pack ID field.");
        const batchId = document.getElementById('cln_batch').value.trim();
        const clinicName = document.getElementById('cln_clinic_name').value.trim();
        const clinicLoc = document.getElementById('cln_clinic_loc').value.trim();
        const responsibleName = document.getElementById('cln_responsible_name').value.trim();
        const responsibleEmail = document.getElementById('cln_responsible_email').value.trim();
        const qtyReceived = document.getElementById('cln_qty_received').value.trim();
        const qtyUnit = document.getElementById('cln_qty_unit').value.trim();
        const receivedTime = document.getElementById('cln_received_time').value.trim();
        const storageCondition = document.getElementById('cln_storage_condition').value.trim();

        database.doc(packId).set({
            Clinic: {
                Batch_ID_of_Medicine_received_from_Retailer: batchId,
                Clinic_Name: clinicName,
                Clinic_Location: clinicLoc,
                Clinic_Manager: responsibleName,
                Manager_Email: responsibleEmail,
                Quantity_Received_from_Retailer: qtyReceived,
                Quantity_Unit: qtyUnit,
                DateTime_Received: receivedTime,
                Storage_Condition: storageCondition,
                Added_to_Database: timestamp()
            }
        }, { merge: true }).then(response => {
            alert(`Ownership of Pack ID ${packId} successfully transferred to Clinic: ${clinicName}, ${clinicLoc}`);
            resetformsandbtns();
        }).catch(error => alert(`Error transferring ownership to Clinic in database : ${error}`));
    };
    transferOwnerBtn.textContent = "Transfer Ownership: Retailer → Clinic";
    transferformsandbtns();
}

function transferownerfromclinictocustomer(packid) {
    transferownerform.innerHTML = `
        <h2>Transfer Ownership: Clinic → Customer</h2>
        <label for="cst_pack">Pack ID:</label>
        <input type="text" id="cst_pack" name="cst_pack" value="\${packid}" readonly required>
        <label for="cst_new_owner">New Owner Category:</label>
        <input type="text" id="cst_new_owner" name="cst_new_owner" value="Customer" readonly required>
        <label for="cst_batch">Batch ID:</label>
        <input type="text" id="cst_batch" name="cst_batch" placeholder="e.g., CLN-BATCH-2025-021" required>
        <label for="cst_customer_name">Customer Name:</label>
        <input type="text" id="cst_customer_name" name="cst_customer_name" placeholder="e.g., Ananya Sharma" required>
        <label for="cst_customer_email">Customer Email ID:</label>
        <input type="email" id="cst_customer_email" name="cst_customer_email" placeholder="e.g., ananya.sharma@gmail.com" required>
        <label for="cst_qty_received">Quantity Received:</label>
        <input type="number" id="cst_qty_received" name="cst_qty_received" placeholder="e.g., 2" required>
        <label for="cst_qty_unit">Quantity Unit:</label>
        <input type="text" id="cst_qty_unit" name="cst_qty_unit" placeholder="e.g., strips, tablets, g" required>
        <label for="cst_received_time">Date and Time of Receiving the Medicine:</label>
        <input type="datetime-local" id="cst_received_time" name="cst_received_time" required>
        <button type="submit">Transfer Ownership</button>
        <button type="reset">Reset Form</button>
    `;

    
    transferownerform.onsubmit = (e) => {
        e.preventDefault();

        const cst_pack = document.getElementById('cst_pack');
        if (!cst_pack) return;

        const packId = cst_pack.value.trim();
        if(packId !== packid)    return alert("Pack ID mismatch. Please do not change the Pack ID field.");
        const batchId = document.getElementById('cst_batch').value.trim();
        const customerName = document.getElementById('cst_customer_name').value.trim();
        const customerEmail = document.getElementById('cst_customer_email').value.trim();
        const qtyReceived = document.getElementById('cst_qty_received').value.trim();
        const qtyUnit = document.getElementById('cst_qty_unit').value.trim();
        const receivedTime = document.getElementById('cst_received_time').value.trim();

        database.doc(packId).set({
            Customer: {
                Batch_ID_of_Medicine_received_from_Clinic: batchId,
                Customer_Name: customerName,
                Customer_Email: customerEmail,
                Quantity_Received_from_Clinic: qtyReceived,
                Quantity_Unit: qtyUnit,
                DateTime_Received: receivedTime,
                Added_to_Database: timestamp()
            }
        }, { merge: true }).then(response => {
            alert(`Ownership of Pack ID ${packId} successfully transferred to Customer: ${customerName}`);
            resetformsandbtns();
        }).catch(error => alert(`Error transferring ownership to Customer in database : ${error}`));
    };
    transferOwnerBtn.textContent = "Transfer Ownership: Clinic → Customer";
    transferformsandbtns();
}

const firebase = window.firebase;
const firebaseConfig = {
    apiKey: "AIzaSyBIBLM3Sa-uq8lGFLJpU4WkLLGRcU4VBWM",
    authDomain: "prajwal-das-cse-projects.firebaseapp.com",
    projectId: "prajwal-das-cse-projects",
    storageBucket: "prajwal-das-cse-projects.firebasestorage.app",
    messagingSenderId: "475168255084",
    appId: "1:475168255084:web:8e5ca302083ec44ec67c49",
    measurementId: "G-0WQ8970XQJ"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.firestore().collection('Smart_India_Hackathon');
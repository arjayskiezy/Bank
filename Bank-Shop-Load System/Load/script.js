document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('recordButton');
    const promoTypeInput = document.getElementById('promoType');
    const phoneNumberInput = document.getElementById('phoneNumber'); 
    const recordTable = document.getElementById('recordTable');
    const dashboardButton = document.getElementById('dashboardButton');
    const dashBoard = document.getElementById('dashBoard');
    const backButton = document.getElementById('backButton');
    const frequentlySold = document.getElementById('frequentlySold');
    const averageSale = document.getElementById('averageSale');
    const leastPopularPromo = document.getElementById('leastPopularPromo');

        const validPromoTypes = [
            "GoPLUS99",
            "GoPLUS129",
            "GoPLUS149",
            "GoPLUS250",
            "GoPLUS400",
            "LevelUp99",
            "LevelUp199",
            "LevelUp299",
            "LevelUp399",
            "GIGA WORK PRO 199 ", 
            "GIGA WORK PRO 599", 
            "GIGA WORK PRO 999",
            "GIGA STUDY PRO 199", 
            "GIGA STUDY PRO 599",
            "GIGA STUDY PRO 999",
            "GIGA STORIES PRO 199",
            "GIGA STORIES PRO 599",
            "GIGA STORIES PRO 599", 
            "GIGA GAMES PRO 199", 
            "GIGA GAMES PRO 599",
            "GIGA GAMES PRO 999",
            "GIGA PRO VIDEO 199", 
            "GIGA PRO VIDEO 599",
            "GIGA PRO VIDEO 999",
            "GIGA K-VIDEO 50", 
            "GIGA K-VIDEO 99", 
            "GIGA K-VIDEO 299",
            "GIGA K-VIDEO 399",
            "GIGA K-VIDEO 499",
            "Mega All-In 250",
            "CTS 15", "CTS 29", 
            "CTS 49", "CTS 109",
            "SurfMax50",
            "SurfMax85",
            "SurfMax200",
            "SurfMax250",
                "SurfMax500",
            "SurfMax995",
            "SurfMax Plus 100",
            "SurfMax Plus 350", 
            "SurfMax Plus 600",
            "SurfMax Plus 995",
            "BRO ALLOUTSURF 50", 
            "BRO ALLOUTSURF 99",
            "Big Bytes 5", 
            "Big Bytes 10", 
            "Big Bytes 15",
            "Big Bytes 39",
            "Big Bytes 50",
            "Big Bytes 70", 
            "Big Bytes 99",
            "Youtube 5",
            "Youtube 25",
            "Youtube 50",
            "Youtube 199",
            "GigaNight 15",
            "GigaNight 25",
            "HOME BOOST 15",
            "GIGA VIDEO+ 149",
            "HOME BOOST 50",
            "HOME BOOST 100",
            "HOME BOOST 349",
            "HOME BOOST 599",
            "All Out Surf 20",
            "All Out Surf 30", 
            "All Out Surf 50",
            "All Out Surf 99",
            "GigaSurf 50", 
            "GigaSurf 70",
            "GigaSurf 99", 
            "GigaSurf 299",
            "GigaSurf 399",
            "GigaSurf 499", 
            "GigaSurf+ 75",
            "GigaSurf+ 149",
            "GigaSurf+ 449",
            "GigaSurf+ 549",
            "GigaSurf+ 649",
            "GigaSurf AllNet 100",
            "GigaSurf AllNet 199",
            "GigaSurf AllNet 549",
            "GigaSurf AllNet 649",
            "GigaSurf AllNet 749",
            "GigaSurf w/ IG+FB 50", 
            "GigaSurf w/ IG+FB 99",
            "GigaSurf w/ IG+FB 299",
            "GigaSurf w/ IG+FB 399", 
            "GigaSurf w/ IG+FB 499",
            "GigaSurf Games 50",
            "GigaSurf Games 99",
            "GigaSurf Games 299",
            "GigaSurf Games 399",
            "GigaSurf Games 499",
            "Always On 10",
            "Always On 199",
            "SMART ALLNET30",
            "Video TimeOut 10",
            "Video TimeOut 25",
            "Sakto 20",
            "Sakto 30",
            "Sakto Data 30",
            "Sakto Data 99",
            "All Text 10",
            "All Text 12",
            "All Text 20",
            "All Text 25",
            "UCT25",
            "All Text 30",
            "All Text 60",
            "Lahatxt 20",
            "Lahatxt 30"
        ];
        // Initialize promoSales object to track sales
    let promoSales = {};

    const storedPromoSales = localStorage.getItem('promoSales');
    if (storedPromoSales) {
        promoSales = JSON.parse(storedPromoSales);
    }       

    function calculateSummary() {
        let totalSales = 0; 
        let totalPromos = 0;
        let leastPopular = '';
        let leastSales = Infinity;
        let mostSales = 0;
        let mostPopular = '';

        for (const promo in promoSales) {
            totalSales += promoSales[promo];
            totalPromos++;
            if (promoSales[promo] < leastSales) {
                leastSales = promoSales[promo];
                leastPopular = promo;
            }
            if (promoSales[promo] > mostSales) {
                mostSales = promoSales[promo];
                mostPopular = promo;
            }
        }

        const totalAmount = Object.values(promoSales).reduce((acc, val) => acc + val, 0);
        const average = totalSales;
        frequentlySold.textContent = mostPopular;
        averageSale.textContent = average.toFixed(2);
        leastPopularPromo.textContent = leastPopular;
        const totalSaleCell = document.getElementById('totalSale');
        totalSaleCell.textContent = totalAmount;
    }

// Inside the event listener for the record button
recordButton.addEventListener('click', function() {
    const promoType = promoTypeInput.value.trim();
    const phoneNumber= phoneNumberInput.value;
    if (promoType) {
        const isValid = validPromoTypes.some(validType => validType.toLowerCase() === promoType.toLowerCase());
        if (isValid) {
            const newRow = recordTable.insertRow(-1);
            const typeCell = newRow.insertCell(0);
            typeCell.textContent = promoType.toUpperCase();
            const amountMatch = promoType.match(/\d+/);
            let amount = parseFloat(amountMatch[0]);
            const loadFee = Math.floor(amount / 10); // Calculate load fee
            amount += loadFee; // Add load fee to amount
            const amountCell = newRow.insertCell(1);
            amountCell.textContent = '₱' + amount;
            const dateCell = newRow.insertCell(2);
            const currentDate = new Date();
            dateCell.textContent = currentDate.toLocaleString();
            promoTypeInput.value = '';
            phoneNumberInput.value = '';

            // Update promoSales object
            if (promoSales[promoType]) {
                promoSales[promoType]++;
            } else {
                promoSales[promoType] = 1;
            }
            localStorage.setItem('promoSales', JSON.stringify(promoSales));
            alert('Registered Succesfully!');

            // Make a Fetch request to the backend server
            fetch('http://localhost:8081/promo-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ 
                    phoneNumber: phoneNumber, // Include the phone number value as a string 
                    promoType: promoType.toUpperCase(),
                    amount: amount,
                    date: currentDate.toISOString()
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error sending promo data:', error);
            });

        } else {
            alert('Invalid Promo Type!');
            promoTypeInput.value = '';
        }
        
    }
});


    dashboardButton.addEventListener('click', function() {
        document.getElementById('register').style.display = 'none';
        dashBoard.style.display = 'block';
        calculateSummary();
    });

    backButton.addEventListener('click', function() {
        document.getElementById('register').style.display = 'block';
        dashBoard.style.display = 'none';
    });


});
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const resultsDiv = document.getElementById('results');
    const totalAmountInput = document.getElementById('totalAmount');
    const memberInput = document.getElementById('memberInput');
    const parseMembersBtn = document.getElementById('parseMembers');
    const memberChips = document.getElementById('memberChips');
    const minAmountInput = document.getElementById('minAmount');
    const maxAmountInput = document.getElementById('maxAmount');

    let members = [];

    function updateMemberChips() {
        memberChips.innerHTML = '';
        members.forEach((member, index) => {
            const chip = document.createElement('div');
            chip.className = 'member-chip';
            chip.innerHTML = `
                <span class="member-name">${member}</span>
                <span class="remove-member" data-index="${index}">×</span>
            `;
            memberChips.appendChild(chip);
        });

        // 멤버 삭제 이벤트 리스너 추가
        document.querySelectorAll('.remove-member').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                members.splice(index, 1);
                updateMemberChips();
                validateInputs();
            });
        });
    }

    parseMembersBtn.addEventListener('click', () => {
        const text = memberInput.value.trim();
        if (!text) {
            alert('카톡방 멤버 목록을 붙여넣어주세요!');
            return;
        }

        // 줄바꿈으로 구분된 이름을 배열로 변환
        members = text.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (members.length === 0) {
            alert('유효한 멤버 이름을 찾을 수 없습니다.');
            return;
        }

        updateMemberChips();
        validateInputs();
    });

    function validateInputs() {
        const totalAmount = parseInt(totalAmountInput.value);
        const peopleCount = members.length;
        const minAmount = parseInt(minAmountInput.value);
        const maxAmount = parseInt(maxAmountInput.value);

        // 값이 비어있거나 숫자가 아닌 경우 검사하지 않음
        if (!totalAmount || !peopleCount || !minAmount || !maxAmount) {
            generateBtn.disabled = true;
            return false;
        }

        // 최소값이 최대값보다 큰 경우
        if (minAmount > maxAmount) {
            alert('최소 금액이 최대 금액보다 클 수 없습니다.');
            generateBtn.disabled = true;
            return false;
        }

        // 참가자가 2명 이상인지 확인
        if (peopleCount < 2) {
            generateBtn.disabled = true;
            return false;
        }

        // 모든 값이 입력된 경우에만 총액 검사
        if (totalAmount && peopleCount && minAmount && maxAmount) {
            // 최대 금액이 (총액 - (인원수-1)×최소금액)을 초과하는지 검사
            const maxPossibleAmount = totalAmount - (peopleCount - 1) * minAmount;
            if (maxAmount > maxPossibleAmount) {
                alert(`최대 금액은 ${formatNumber(maxPossibleAmount)}원을 초과할 수 없습니다.\n(총액 - (인원수-1)×최소금액)`);
                generateBtn.disabled = true;
                return false;
            }

            if (totalAmount < peopleCount * minAmount) {
                alert('총 금액이 너무 적습니다. 최소 금액 × 인원수 이상이어야 합니다.');
                generateBtn.disabled = true;
                return false;
            }

            if (totalAmount > peopleCount * maxAmount) {
                alert('총 금액이 너무 많습니다. 최대 금액 × 인원수 이하여야 합니다.');
                generateBtn.disabled = true;
                return false;
            }
        }

        generateBtn.disabled = false;
        return true;
    }

    // 숫자 입력 필드에서 음수 입력 방지
    [totalAmountInput, minAmountInput, maxAmountInput].forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value;
            if (value < 0) {
                e.target.value = 0;
            }
            validateInputs();
        });
    });
    
    generateBtn.addEventListener('click', () => {
        if (members.length === 0) {
            alert('참가자 목록을 입력해주세요!');
            return;
        }

        const totalAmount = parseInt(totalAmountInput.value);
        const peopleCount = members.length;
        const minAmount = parseInt(minAmountInput.value);
        const maxAmount = parseInt(maxAmountInput.value);
        
        const amounts = generateRandomAmounts(totalAmount, peopleCount, minAmount, maxAmount);
        const shuffledAmounts = shuffleArray([...amounts]);
        
        resultsDiv.innerHTML = '';
        shuffledAmounts.forEach((amount, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="name">${members[index]}</div>
                <div class="amount">${formatNumber(amount)}원</div>
            `;
            resultsDiv.appendChild(resultItem);
        });
    });

    function generateRandomAmounts(total, count, min, max) {
        let amounts = [];
        let remainingAmount = total;
        let remainingPeople = count;
        
        for (let i = 0; i < count - 1; i++) {
            const maxPossible = Math.min(
                max,
                remainingAmount - (remainingPeople - 1) * min
            );
            const minPossible = Math.max(
                min,
                remainingAmount - (remainingPeople - 1) * max
            );
            
            const amount = Math.floor(
                Math.random() * (maxPossible - minPossible + 1) + minPossible
            );
            
            amounts.push(amount);
            remainingAmount -= amount;
            remainingPeople--;
        }
        
        amounts.push(remainingAmount);
        return amounts;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}); 
const accessParams = {
  grant_type: "client_credentials",
  appkey: "qDyfxixyK38gUcyxhhiV8RKDD_LALkd-zBzDYcWJQP4",
  secretkey: "egNgDJdNQkg6b8t5UBfGu-pAr0UJwlzGapfVwc73vn0",
};

const chartParams = {
  dmst_stex_tp: "KRX", // 국내거래소구분 KRX,NXT,SOR
  stk_cd: "005930", // 종목코드
  ord_qty: "1", // 주문수량
  ord_uv: "", // 주문단가
  trde_tp: "3", // 매매구분 0:보통 , 3:시장가 , 5:조건부지정가 , 81:장마감후시간외 , 61:장시작전시간외, 62:시간외단일가 , 6:최유리지정가 , 7:최우선지정가 , 10:보통(IOC) , 13:시장가(IOC) , 16:최유리(IOC) , 20:보통(FOK) , 23:시장가(FOK) , 26:최유리(FOK) , 28:스톱지정가,29:중간가,30:중간가(IOC),31:중간가(FOK)
  cond_uv: "", // 조건단가
};

async function fetchToken() {
  const url = "https://mockapi.kiwoom.com/oauth2/token";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify(accessParams),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.token;
}

async function fetchProgramTradeRanking(token) {
  const url = "https://mockapi.kiwoom.com/api/dostk/ordr";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
      "api-id": "kt10000",
      "cont-yn": "N",
      "next-key": "",
    },
    body: JSON.stringify(chartParams),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.prm_netprps_upper_50 || [];
}

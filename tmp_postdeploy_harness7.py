import requests,time,re
BASE='http://127.0.0.1:8000'
SEN='http://127.0.0.1:3001'
login=requests.post(BASE+'/api/auth/login',json={'identifier':'mvpadmin','password':'Admin!2026'},timeout=15)
if not login.ok:
    print('HARNESS_RESULT FAIL login')
    raise SystemExit(1)
t=login.json().get('access_token','')
h={'Authorization':'Bearer '+t}
ok_all=True
for i in range(1,8):
    notes=[]
    ok=True
    st=requests.get(BASE+'/api/intelligence/status',timeout=15).json()
    bl=st.get('ble_listener',{})
    if bl.get('mode')!='ble_pool' or not bl.get('running'):
        ok=False
        notes.append('ble_pool')
    env=requests.get(BASE+'/api/intelligence/environment/live?window_minutes=360',headers=h,timeout=15).json()
    if env.get('data_mode')!='sensor_offline':
        ok=False
        notes.append('env_not_offline')
    html=requests.get(SEN,timeout=20).text
    for m in ['Unread alerts:','Hydration level (live)','No live appointments','Sensor offline']:
        if m not in html:
            ok=False
            notes.append('missing_'+m)
    for b in ['Dr. Smith','Physical Therapy','2,847','6/8','3/4','2/3']:
        if re.search(r'>\s*'+re.escape(b)+r'\s*<',html):
            ok=False
            notes.append('mock_'+b)
    notes_text=';'.join(notes) if notes else 'none'
    print(f'loop={i} ok={ok} notes={notes_text}')
    ok_all=ok_all and ok
    time.sleep(2)
comp=requests.get('http://127.0.0.1:8001/health',timeout=15).json()
model_ok='llama3.2-1b-instruct' in str(comp.get('model_id',''))
print('companion_model_ok',model_ok)
print('HARNESS_RESULT', 'PASS' if (ok_all and model_ok) else 'FAIL')

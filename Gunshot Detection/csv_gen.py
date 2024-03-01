import glob
import os
import shutil

def rename_files():
    prefix="/Users/jaycrappe/Documents/GitHub/Gun-classification-using-gunshot/Datas/"
    paths = ["Ruger357","Ruger22","Glock9"]
    index = 10
    for x in paths:
        p=f"{prefix}{x}/"
        os.chdir(p)
        files = glob.glob(f"{p}*.wav")
        count = 1
        for f in files:
            os.rename(f, f"{index} ({count}).wav")
            count += 1
        index += 1

def collect_files():
    prefix="/Users/jaycrappe/Documents/GitHub/Gun-classification-using-gunshot/Datas/"
    to_prefix="/Users/jaycrappe/Documents/GitHub/Gun-classification-using-gunshot/Data/"
    paths=['IMI Desert Eagle', 'Ruger22', 'M249', 'AK-47', 'AK-12', 'Zastava M92', 'Glock9', 'M4', 'MP5', 'M16', 'Ruger357', 'MG-42']
    for x in paths:
        p=f"{prefix}{x}/"
        os.chdir(p)
        files = glob.glob(f"{p}*.wav")
        for f in files:
            print(f)
            shutil.copy(f, to_prefix)

def get_gun_val_map():
    gun_val_map={}
    prefix="/Users/jaycrappe/Documents/GitHub/Gun-classification-using-gunshot/Datas/"
    paths=['IMI Desert Eagle', 'Ruger22', 'M249', 'AK-47', 'AK-12', 'Zastava M92', 'Glock9', 'M4', 'MP5', 'M16', 'Ruger357', 'MG-42']
    for x in paths:
        p=f"{prefix}{x}/"
        os.chdir(p)
        files = glob.glob(f"{p}*.wav")
        gun_val=files[0].split("/")[-1].split(" ")[0]
        gun_val_map[gun_val]=x
    return gun_val_map


def generate_csv():
    prefix="/Users/jaycrappe/Documents/GitHub/Gun-classification-using-gunshot/Data/"
    # os.chdir(prefix)
    files = glob.glob(f"{prefix}*.wav")
    gun_val_map = get_gun_val_map()
    with open('/Users/jaycrappe/Documents/GitHub/Gun-classification-using-gunshot/guns.csv', 'w') as f:
        f.write("sound,Fold,Cateogry,Target\n")
        for x in files:
            gun_name = x.split("/")[-1]
            gun_val = gun_name.split(" ")[0]
            f.write(f"{gun_name},5,{gun_val_map[gun_val]},{gun_val}\n")

generate_csv()
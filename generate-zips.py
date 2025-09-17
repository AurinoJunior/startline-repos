import os
import zipfile
from pathlib import Path

def criar_zip_diretorios(diretorios_disponiveis):
    dest_path = Path('.zip')
    dest_path.mkdir(exist_ok=True)

    for diretorio in diretorios_disponiveis:
        nome_zip = f"{diretorio.name}.zip"
        caminho_zip = dest_path / nome_zip
        
        print(f"Criando {nome_zip}...")
        
        try:
            with zipfile.ZipFile(caminho_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(diretorio):
                    for file in files:
                        file_path = Path(root) / file
                        arcname = file_path.relative_to(diretorio.parent)
                        zipf.write(file_path, arcname)
            
            print(f"✓ {nome_zip} criado com sucesso!")
            
        except Exception as e:
            print(f"✗ Erro ao criar {nome_zip}: {e}")
    
    print(f"\nTodos os ZIPs foram salvos em: {dest_path.absolute()}")

def listar_diretorios_disponiveis(diretorios):
    if diretorios:
        print("Diretórios disponíveis:")
        for dir in sorted(diretorios):
            print(f"  - {dir.name}")
    else:
        print("Nenhum diretório encontrado.")
    
    return diretorios

if __name__ == "__main__":
    base_path = Path('.')
    diretorios = [item for item in base_path.iterdir() 
                  if item.is_dir() and not item.name.startswith('.')]
    
    diretorios_disponiveis = listar_diretorios_disponiveis(diretorios)
    if diretorios_disponiveis:
        print(f"\nIniciando criação de ZIPs...\n")
        
        criar_zip_diretorios(diretorios_disponiveis)
        
        print("\nProcesso concluído!\n")
    else:
        print("Não há diretórios para processar.")
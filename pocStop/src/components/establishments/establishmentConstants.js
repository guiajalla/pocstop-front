export const CATEGORIAS = [
  'Bar', 'Restaurante', 'Cafeteria', 'Boate / Club', 'Espaço Cultural',
  'Drag Show', 'Hotel / Hospedagem', 'Salão de Beleza', 'Clínica / Saúde', 'Loja',
  'Academia', 'Livraria', 'Outro',
]

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export const emptyForm = () => ({
  nome: '', cidade: '', estado: '', redeSocial: '', linkRedeSocial: '', sugeridoPor: '',
  endereco: '', bairro: '', pais: 'Brasil',
  latitude: '', longitude: '',
  categoriaPrincipal: '', categoriaSecundaria: '',
  donoLGBT: false,
})

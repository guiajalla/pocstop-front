export const CATEGORIAS = [
  'Bar', 'Restaurante', 'Cafeteria', 'Boate / Club', 'Espaço Cultural',
  'Drag Show', 'Hotel / Hospedagem', 'Salão de Beleza', 'Clínica / Saúde', 'Loja',
  'Academia', 'Livraria', 'Outro',
]

export const emptyForm = () => ({
  nome: '', cidade: '', redeSocial: '', linkRedeSocial: '', sugeridoPor: '',
  endereco: '', bairro: '', pais: 'Brasil',
  latitude: '', longitude: '',
  categoriaPrincipal: '', categoriaSecundaria: '',
  donoLGBT: false,
})

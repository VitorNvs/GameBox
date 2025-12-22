import jwt from 'jsonwebtoken';

const JWT_SECRET = 'seu-segredo-super-secreto-123';


const authMiddleware = (req, res, next) => {
    // 1. Obter o cabeçalho Authorization
    const authHeader = req.header('Authorization');

    // 2. Verificar se o cabeçalho existe e está no formato 'Bearer token'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Autenticação falhou: Token ausente ou formato inválido.');
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou inválido.' });
    }

    // 3. Extrair o token (removendo "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verificar e decodificar o token
        // O método 'verify' lançará um erro se o token for inválido ou expirado.
        const decoded = jwt.verify(token, JWT_SECRET);

        // 5. Anexar os dados decodificados (payload) à requisição
        // Assumimos que o payload contém o ID do usuário (ex: { id: 'userID_123' })
        req.user = decoded;
        
        // 6. Prosseguir para o próximo manipulador de rota
        next();

    } catch (err) {
        // O token é inválido (expirado, assinado incorretamente, etc.)
        console.error('Verificação de token falhou:', err.message);
        return res.status(401).json({ message: 'Token inválido ou expirado. Acesso não autorizado.' });
    }
}

export default authMiddleware;
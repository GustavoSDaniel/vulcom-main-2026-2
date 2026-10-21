
import prisma from '../database/client.js'

const controller = {}

controller.retrieveComments = async function (req, res) {
  try {
    const comments = await prisma.xssComment.findMany({
      orderBy: { id: 'asc' }
    })

    res.json(comments)
  } catch (error) {
    console.error('Erro ao buscar comentários:', error)
    res.status(500).json({
      error: 'Erro interno ao buscar comentários.'
    })
  }
}

controller.createComment = async function (req, res) {
  try {
    const content = req.body?.content

    // Validação de entrada.
    if (typeof content !== 'string') {
      return res.status(400).json({
        error: 'O comentário deve ser um texto.'
      })
    }

    if (content.trim().length === 0 || content.length > 2000) {
      return res.status(400).json({
        error: 'O comentário deve ter entre 1 e 2000 caracteres.'
      })
    }

    // O conteúdo é armazenado como texto.
    // A proteção principal contra XSS também deve ser
    // aplicada no front-end, durante a renderização.
    await prisma.xssComment.create({
      data: { content }
    })

    return res.status(201).json({
      message: 'Comentário criado com sucesso.'
    })
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    return res.status(500).json({
      error: 'Erro interno ao criar comentário.'
    })
  }
}

export default controller

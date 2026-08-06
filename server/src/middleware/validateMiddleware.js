export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    if (err.errors) {
      const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ success: false, error: `Validation error: ${messages}` });
    }
    return res.status(400).json({ success: false, error: err.message || 'Invalid input data.' });
  }
};

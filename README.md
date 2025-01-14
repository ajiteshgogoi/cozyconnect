# Cozy Connect - Conversation Prompts

Cozy Connect is an AI-powered conversation prompt generator designed to foster meaningful connections through thoughtful dialogue. By generating context-aware, open-ended questions, it helps break the ice and deepen conversations naturally.

## Features

- **Dynamic Question Generation**: Leverages AI to create unique, thought-provoking questions
- **Multi-dimensional Context**: Combines themes, perspectives, and emotional contexts for well-rounded prompts
- **Conversation-Friendly Format**: Questions are designed to encourage storytelling and sharing
- **Safe and Inclusive**: Built-in guidelines to avoid sensitive topics while maintaining depth

## Core Components

- **Themes**: Covers various life aspects including relationships, personal growth, values, and experiences
- **Perspectives**: Temporal viewpoints (childhood, present moment, future aspirations)
- **Emotional Contexts**: Different emotional tones to add depth to conversations
- **Question Patterns**: Template-based structure ensuring consistent quality

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ajiteshgogoi/easyconnect
cd easyconnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
# Add your LLM API credentials to .env
```

## Usage

### API Endpoint

```javascript
POST /api/generate

// Response
{
  "question": "What childhood experience shaped your understanding of trust in relationships?"
}
```

### Example Integration

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.question);
```

## Configuration

You can customize the question generation by modifying:
- `themes` array: Add or modify conversation topics
- `perspectives` array: Adjust temporal viewpoints
- `emotionalContexts` array: Add different emotional tones
- `questionPatterns` array: Add new question templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to Llama 3.3 for powering our question generation
- Inspired by the need for deeper, more meaningful conversations in our digital age

## Support

For support, please open an issue in the repository or contact us at ajiteshgogoi@gmail.com
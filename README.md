# Cozy Connect - Conversation Prompts

Cozy Connect is an AI-powered conversation starter generator designed to foster natural, engaging conversations through simple, friendly questions. It helps break the ice and deepen connections by generating prompts that feel like questions a good friend would ask.

## Features

- **Natural Questions**: Generates conversational prompts that sound authentic and friendly
- **Time-Based Perspectives**: Questions span from childhood memories to future aspirations
- **Simple & Clear**: Each question is concise and easy to understand
- **Positive Focus**: Emphasizes uplifting and engaging topics
- **Story-Friendly**: Encourages sharing of experiences and memories

## Question Categories

### Themes
- **Relationships**: Trust, friendship, family, love, connection
- **Personal Growth**: Change, challenges, learning, strengths, decisions
- **Values**: Purpose, success, beliefs, passion, helping others
- **Life Experiences**: Adventures, achievements, mistakes, surprises, transitions

### Time Perspectives
- **Childhood**: Early years and childhood memories
- **Past**: Teen years through recent past experiences
- **Present**: Current situations and ongoing experiences
- **Future**: Goals, dreams, and aspirations

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ajiteshgogoi/cozyconnect.git
cd cozyconnect
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
  "question": "What adventure in your life stands out to you?"
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

## Question Guidelines

Each generated question follows these principles:
- Under 12 words long
- Focuses on a single, clear topic
- Uses simple, everyday language
- Sounds natural and conversational
- Encourages storytelling and sharing
- Maintains a positive or neutral tone

## Configuration

You can customize the generator by modifying:
- `themes` array: Adjust conversation topics
- `perspectives` array: Modify time perspectives
- `questionPatterns` object: Update question templates for each perspective

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

- Thanks to [LLM Provider] for powering our question generation
- Inspired by the art of meaningful conversation

## Support

For support, please open an issue in the repository or contact us at ajiteshgogoi@gmail.com